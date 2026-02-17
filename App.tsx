
import React, { useState, useRef, useEffect } from 'react';
import Editor from './components/Editor';
import Sidebar from './components/Sidebar';
import SettingsModal from './components/SettingsModal';
import DevOpsGallery from './components/DevOpsGallery';
import UpgradeModal from './components/UpgradeModal';
import PricingPage from './components/PricingPage';
import LimitReachedModal from './components/LimitReachedModal';
import { SUGGESTIONS } from './constants';
import { geminiService } from './services/geminiService';
import { authService } from './services/authService';
import { exportAsZip, validateTerraform, copyAllFiles } from './services/utils';
import { AppStatus, Message, TerraformFiles, ProjectSession } from './types';
import { getStoredTheme, setStoredTheme, themes, Theme } from './theme';

interface AppProps {
  user: any & { plan?: 'FREE' | 'PRO' };
  onLogout: () => void;
  onNavigate?: (page: string) => void;
}

const App: React.FC<AppProps> = ({ user, onLogout, onNavigate }) => {
  const [prompt, setPrompt] = useState('');
  const [files, setFiles] = useState<TerraformFiles>({});
  const [activeFilename, setActiveFilename] = useState<string>('main.tf');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<ProjectSession[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string>(() => Math.random().toString(36).substr(2, 9));
  const [currentDbId, setCurrentDbId] = useState<number | null>(null);
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme());
  const [searchQuery, setSearchQuery] = useState('');
  const [projectTitle, setProjectTitle] = useState('Cloud Stack');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDevOpsGallery, setShowDevOpsGallery] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showPricingPage, setShowPricingPage] = useState(false);
  const [showLimitReached, setShowLimitReached] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const projects = await authService.getProjects();
      const mapped = projects.map((p: any) => ({
        id: p.id.toString(),
        title: p.title,
        timestamp: new Date(p.updated_at).getTime(),
        messages: p.messages,
        files: p.files,
        dbId: p.id,
        isFavorite: p.is_favorite === 1,
        updatedAt: p.updated_at
      }));
      setHistory(mapped);
    } catch (err) {
      console.error('Failed to load projects', err);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm('Delete this project?')) return;
    try {
      await authService.deleteProject(id);
      await loadProjects();
      if (currentDbId === id) handleNewChat();
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  const handleToggleFavorite = async (id: number, isFavorite: boolean) => {
    try {
      await authService.toggleFavorite(id, !isFavorite);
      await loadProjects();
    } catch (err) {
      console.error('Failed to toggle favorite', err);
    }
  };

  const handleThemeToggle = async () => {
    const newTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    setStoredTheme(newTheme);
    try {
      await authService.updateTheme(newTheme);
    } catch (err) {
      console.error('Failed to update theme', err);
    }
  };

  const handleDevOpsClick = () => {
    if (user?.plan === 'FREE' || !user?.plan) {
      setShowUpgradeModal(true);
    } else {
      setShowDevOpsGallery(true);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Only save when not streaming
    if (status === AppStatus.IDLE && messages.length > 0 && Object.keys(files).length > 0) {
      const timer = setTimeout(() => {
        saveProject();
      }, 1000); // Debounce save
      return () => clearTimeout(timer);
    }
  }, [status, messages.length, Object.keys(files).length]);

  const parseContent = (text: string) => {
    const fileMap: TerraformFiles = { ...files };
    const fileRegex = /\[FILE:\s*([a-zA-Z0-9_.-]+)\]/g;
    const parts = text.split(fileRegex);
    
    if (parts.length > 1) {
      for (let i = 1; i < parts.length; i += 2) {
        const filename = parts[i].trim();
        let content = parts[i + 1] ? parts[i + 1].trim() : '';
        content = content.split('[SUGGESTIONS:')[0].split('[FILE:')[0].trim();
        fileMap[filename] = content;
      }
    }

    let conversationText = text.replace(/\[FILE:[\s\S]*?\]/g, '').replace(/\[SUGGESTIONS:[\s\S]*?\]/g, '').trim();
    const suggRegex = /\[SUGGESTIONS:\s*([\s\S]*?)\]/;
    const suggMatch = text.match(suggRegex);
    let suggestions: string[] = [];
    if (suggMatch) {
      suggestions = suggMatch[1].split(',').map(s => s.trim());
    }

    return { fileMap, conversationText, suggestions };
  };

  const saveProject = async () => {
    try {
      const title = projectTitle || "Cloud Stack";
      
      if (currentDbId) {
        await authService.updateProject(currentDbId, title, files, messages);
        await loadProjects();
      } else {
        try {
          const result = await authService.saveProject(title, files, messages);
          setCurrentDbId(result.id);
          await loadProjects();
        } catch (err: any) {
          if (err.response?.status === 403) {
            setStatus(AppStatus.IDLE);
            setShowLimitReached(true);
            handleNewChat();
            return;
          }
          throw err;
        }
      }
    } catch (err) {
      console.error('Failed to save project', err);
    }
  };

  const handleSubmit = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const finalPrompt = customPrompt || prompt;
    if (!finalPrompt.trim() || status === AppStatus.GENERATING) return;

    setPrompt('');
    setStatus(AppStatus.GENERATING);
    setMessages(prev => [...prev, { role: 'user', content: finalPrompt }]);

    try {
      let accumulatedText = '';
      const stream = geminiService.generateTerraformStream(finalPrompt);
      setMessages(prev => [...prev, { role: 'assistant', content: '', isStreaming: true }]);

      for await (const chunk of stream) {
        accumulatedText += chunk;
        const { fileMap, conversationText, suggestions } = parseContent(accumulatedText);
        
        setFiles(fileMap);
        if (Object.keys(fileMap).length > 0 && (!activeFilename || !fileMap[activeFilename])) {
          setActiveFilename(Object.keys(fileMap)[0]);
        }
        
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last && last.role === 'assistant' && last.isStreaming) {
            return [...prev.slice(0, -1), { 
              role: 'assistant', 
              content: conversationText || "Architecting Zero-Error Blueprint...", 
              isStreaming: true,
              suggestions 
            }];
          }
          return prev;
        });
      }
      
      const finalParsed = parseContent(accumulatedText);
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last && last.role === 'assistant' && last.isStreaming) {
          return [...prev.slice(0, -1), { 
            role: 'assistant', 
            content: finalParsed.conversationText || "Architecture logic validated and finalized.", 
            suggestions: finalParsed.suggestions 
          }];
        }
        return prev;
      });

      setStatus(AppStatus.IDLE);
    } catch (error: any) {
      console.error(error);
      setStatus(AppStatus.ERROR);
      setMessages(prev => [...prev, { role: 'assistant', content: "Blueprint engine error. Ensure your API key is correctly configured for reasoning-heavy models." }]);
    }
  };

  const handleNewChat = () => {
    geminiService.resetChat();
    setFiles({});
    setMessages([]);
    setCurrentProjectId(Math.random().toString(36).substr(2, 9));
    setCurrentDbId(null);
    setProjectTitle('Cloud Stack');
    setActiveFilename('main.tf');
    setStatus(AppStatus.IDLE);
  };

  const onLoadProject = (projectId: string) => {
    const project = history.find(p => p.id === projectId);
    if (project) {
      setFiles(project.files);
      setMessages(project.messages);
      setCurrentProjectId(project.id);
      setCurrentDbId((project as any).dbId || null);
      setProjectTitle(project.title);
      const fnames = Object.keys(project.files);
      if (fnames.length > 0) setActiveFilename(fnames[0]);
    }
  };

  const filteredHistory = history.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImportDevOpsProject = (project: any) => {
    // Check DevOps project limits
    if (user?.plan === 'MONTHLY') {
      // Count DevOps projects imported today
      const today = new Date().toDateString();
      const devopsProjects = history.filter(p => 
        p.title.includes('DevOps') && 
        new Date(p.timestamp).toDateString() === today
      );
      
      if (devopsProjects.length >= 5) {
        setShowLimitReached(true);
        return;
      }
    }
    
    setProjectTitle(project.title);
    setShowDevOpsGallery(false);
    window.open(project.githubUrl, '_blank');
  };

  const t = themes[theme];

  return (
    <>
    <div className="flex h-screen overflow-hidden transition-colors duration-200" style={{ backgroundColor: t.bg, color: t.textPrimary }}>
      <Sidebar 
        files={files} 
        activeFilename={activeFilename} 
        onFileSelect={setActiveFilename} 
        history={filteredHistory}
        onLoadProject={onLoadProject}
        onNewChat={handleNewChat}
        onDeleteProject={handleDeleteProject}
        onToggleFavorite={handleToggleFavorite}
        currentProjectId={currentProjectId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        theme={theme}
        onOpenDevOpsGallery={handleDevOpsClick}
        userPlan={user?.plan || 'FREE'}
      />

      <main className="flex-1 flex flex-col relative transition-colors duration-200" style={{ backgroundColor: t.bg, borderLeft: `1px solid ${t.border}`, borderRight: `1px solid ${t.border}` }}>
        <header className="h-14 flex items-center justify-between px-6 shrink-0 transition-colors duration-200" style={{ backgroundColor: t.sidebar, borderBottom: `1px solid ${t.border}` }}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: t.accent }}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-base font-bold" style={{ color: t.textPrimary }}>Terra.Ai</span>
            </div>
            {isEditingTitle ? (
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                className="text-sm font-semibold px-3 py-1.5 rounded-lg border transition-all duration-200"
                style={{ backgroundColor: t.input, color: t.textPrimary, borderColor: t.accent }}
                autoFocus
              />
            ) : (
              <div onClick={() => setIsEditingTitle(true)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105" style={{ backgroundColor: `${t.accent}15`, border: `1px solid ${t.accent}30` }}>
                <span className="text-sm font-semibold" style={{ color: t.accent }}>{projectTitle}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
             <button 
              onClick={handleThemeToggle}
              className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-105"
              style={{ color: t.textSecondary, backgroundColor: t.hover, border: `1px solid ${t.border}` }}
             >
               {theme === 'dark' ? '☀️' : '🌙'}
             </button>
             <button 
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-105"
              style={{ color: t.textSecondary, backgroundColor: t.hover, border: `1px solid ${t.border}` }}
             >
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
               </svg>
             </button>
             <button 
              onClick={() => exportAsZip(files, projectTitle)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 hover:scale-105"
              style={{ color: 'white', backgroundColor: t.premium }}
             >
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
               </svg>
               ZIP
             </button>
             <button 
              onClick={() => copyAllFiles(files)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-105"
              style={{ color: t.textSecondary, backgroundColor: t.hover, border: `1px solid ${t.border}` }}
             >
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
               </svg>
               COPY ALL
             </button>
          </div>
        </header>
        
        <Editor 
          files={files} 
          activeFilename={activeFilename} 
          onFileSelect={setActiveFilename}
          isStreaming={status === AppStatus.GENERATING} 
        />

        <footer className="h-8 flex items-center justify-between px-6 shrink-0 text-xs font-medium transition-colors duration-200" style={{ backgroundColor: t.sidebar, borderTop: `1px solid ${t.border}`, color: t.textSecondary }}>
           <div className="flex items-center gap-4">
              <span>© 2025 Terra.ai</span>
              <button onClick={() => onNavigate?.('privacy')} className="hover:text-blue-400">Privacy Policy</button>
              <span>|</span>
              <button onClick={() => onNavigate?.('terms')} className="hover:text-blue-400">Terms & Conditions</button>
              <span>|</span>
              <button onClick={() => onNavigate?.('refund')} className="hover:text-blue-400">Refund Policy</button>
              <span>|</span>
              <button onClick={() => onNavigate?.('disclaimer')} className="hover:text-blue-400">Disclaimer</button>
              <span>|</span>
              <button onClick={() => onNavigate?.('contact')} className="hover:text-blue-400">Contact</button>
           </div>
           <div className="flex items-center gap-4">
              <span>Terra.ai</span>
              <span style={{ color: t.accent }}>Project: {currentProjectId}</span>
           </div>
        </footer>
      </main>

      <div className="w-[460px] shrink-0 flex flex-col transition-colors duration-200" style={{ backgroundColor: t.panel, boxShadow: `-4px 0 24px ${t.shadow}` }}>
        <header className="h-14 flex items-center justify-between px-6 transition-colors duration-200" style={{ borderBottom: `1px solid ${t.border}`, backgroundColor: t.sidebar }}>
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full transition-all duration-200" style={{ backgroundColor: status === AppStatus.GENERATING ? t.accent : '#3FB950', boxShadow: status === AppStatus.GENERATING ? `0 0 12px ${t.accent}` : '0 0 8px #3FB950' }}></div>
            <div>
              <span className="text-sm font-bold" style={{ color: t.textPrimary }}>Architect AI</span>
              <p className="text-xs" style={{ color: t.textSecondary }}>Generate production-ready AWS Terraform code</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium" style={{ color: t.textSecondary }}>{user?.name}</span>
            <button onClick={onLogout} className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 hover:scale-105" style={{ color: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>Logout</button>
          </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar transition-colors duration-200" style={{ backgroundColor: t.bg }}>
          {messages.length === 0 ? (
            <div className="py-10 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${t.accent}15`, border: `1px solid ${t.accent}30`, boxShadow: `0 4px 12px ${t.accent}20` }}>
                <svg className="w-8 h-8" style={{ color: t.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
                <h3 className="text-3xl font-black leading-tight" style={{ color: t.textPrimary }}>Perfect AWS<br/>Architecture.</h3>
                <p className="text-sm leading-relaxed font-medium" style={{ color: t.textSecondary }}>I generate syntactically perfect, production-ready Terraform code following strict AWS security benchmarks.</p>
              </div>
              
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: t.textSecondary }}>CERTIFIED TEMPLATES</span>
                <div className="grid gap-3">
                  {SUGGESTIONS.map((s, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleSubmit(undefined, s.prompt)}
                      className="text-left p-5 rounded-2xl transition-all group active:scale-[0.97] duration-200"
                      style={{ backgroundColor: t.card, border: `1px solid ${t.border}`, boxShadow: `0 2px 8px ${t.shadow}` }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = t.accent;
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = t.border;
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div className="flex items-center gap-5">
                        <span className="text-3xl p-3 rounded-2xl transition-all duration-200" style={{ backgroundColor: t.hover, border: `1px solid ${t.border}` }}>{s.icon}</span>
                        <div>
                          <p className="text-sm font-bold transition-colors duration-200" style={{ color: t.textPrimary }}>{s.title}</p>
                          <p className="text-xs mt-1 font-medium leading-normal" style={{ color: t.textSecondary }}>{s.prompt}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={i} className="flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-400">
                <div className="max-w-[95%] rounded-2xl px-6 py-4 text-sm leading-relaxed transition-all duration-200" style={{
                  backgroundColor: m.role === 'user' ? t.accent : t.card,
                  color: m.role === 'user' ? 'white' : t.textPrimary,
                  border: `1px solid ${m.role === 'user' ? t.accent : t.border}`,
                  boxShadow: `0 2px 8px ${t.shadow}`
                }}>
                  {m.content.split('\n').map((line, idx) => {
                     // Enhanced visual styling for headers within the AI conversation
                     const isHeader = line.trim().startsWith('#') || 
                                     line.includes('Strategy') || 
                                     line.includes('Checklist') || 
                                     line.includes('Analysis');
                     
                     if (isHeader) {
                       return (
                         <div key={idx} className="font-bold mt-5 mb-2 uppercase text-xs tracking-wider flex items-center gap-2 pb-1.5" style={{ color: t.accent, borderBottom: `1px solid ${t.accent}30` }}>
                           <div className="w-1 h-3 rounded-full" style={{ backgroundColor: t.accent }}></div>
                           {line.replace(/[#*]/g, '').trim()}
                         </div>
                       );
                     }
                     return <p key={idx} className="mb-2 last:mb-0 opacity-90">{line}</p>;
                  }) || (m.isStreaming && <div className="flex space-x-2 py-3"><div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: t.accent }} /><div className="w-2 h-2 rounded-full animate-bounce [animation-delay:0.2s]" style={{ backgroundColor: t.accent }} /><div className="w-2 h-2 rounded-full animate-bounce [animation-delay:0.4s]" style={{ backgroundColor: t.accent }} /></div>)}
                </div>
                {m.suggestions && m.suggestions.length > 0 && !m.isStreaming && (
                  <div className="flex flex-wrap gap-2.5 pt-2 pl-2">
                    {m.suggestions.map((s, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => handleSubmit(undefined, s)}
                        className="text-xs px-4 py-2 rounded-full font-semibold transition-all duration-200 hover:scale-105"
                        style={{ backgroundColor: t.hover, border: `1px solid ${t.border}`, color: t.textSecondary }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = t.accent;
                          e.currentTarget.style.color = t.accent;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = t.border;
                          e.currentTarget.style.color = t.textSecondary;
                        }}
                      >
                        + {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 transition-colors duration-200" style={{ borderTop: `1px solid ${t.border}`, backgroundColor: t.sidebar }}>
          <div className="relative group">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
              placeholder="Describe your cloud architecture goal..."
              className="w-full rounded-xl px-5 py-4 pr-16 text-sm resize-none h-32 transition-all duration-200 focus:outline-none"
              style={{ 
                backgroundColor: t.input, 
                border: `1px solid ${t.border}`,
                color: t.textPrimary,
                boxShadow: `0 2px 8px ${t.shadow}`
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = t.accent}
              onBlur={(e) => e.currentTarget.style.borderColor = t.border}
            />
            <button 
              type="submit" 
              disabled={status === AppStatus.GENERATING || !prompt.trim()} 
              className="absolute right-4 bottom-4 p-3 rounded-xl text-white transition-all active:scale-90 flex items-center justify-center disabled:opacity-50"
              style={{ backgroundColor: t.accent, boxShadow: `0 4px 12px ${t.accent}40` }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <div className="flex items-center justify-between mt-5 px-1">
             <p className="text-xs font-semibold" style={{ color: t.textSecondary }}>Powered by Terra Engine</p>
             <p className="text-xs font-medium" style={{ color: t.textSecondary }}>Strict Validation</p>
          </div>
        </form>
      </div>
    </div>

    <SettingsModal
      isOpen={showSettings}
      onClose={() => setShowSettings(false)}
      user={user}
      onLogout={onLogout}
      theme={theme}
      onThemeChange={handleThemeToggle}
    />

    <DevOpsGallery
      isOpen={showDevOpsGallery}
      onClose={() => setShowDevOpsGallery(false)}
      onImportProject={handleImportDevOpsProject}
    />

    <UpgradeModal
      isOpen={showUpgradeModal}
      onClose={() => setShowUpgradeModal(false)}
      theme={theme}
      onOpenPricing={() => setShowPricingPage(true)}
    />

    <PricingPage
      isOpen={showPricingPage}
      onClose={() => setShowPricingPage(false)}
      theme={theme}
      user={user}
    />

    <LimitReachedModal
      isOpen={showLimitReached}
      onClose={() => setShowLimitReached(false)}
      onUpgrade={() => setShowPricingPage(true)}
      theme={theme}
      userPlan={user?.plan || 'FREE'}
    />
  </>
);
};

export default App;
