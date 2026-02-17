import React from 'react';
import { TerraformFiles, ProjectSession } from '../types';
import { formatDate } from '../services/utils';
import { themes, Theme } from '../theme';

interface SidebarProps {
  files: TerraformFiles;
  activeFilename: string;
  onFileSelect: (filename: string) => void;
  history: ProjectSession[];
  onLoadProject: (id: string) => void;
  onNewChat: () => void;
  onDeleteProject: (id: number) => void;
  onToggleFavorite: (id: number, isFavorite: boolean) => void;
  currentProjectId: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  theme: Theme;
  onOpenDevOpsGallery: () => void;
  userPlan?: 'FREE' | 'MONTHLY' | 'SIXMONTHS' | 'YEARLY';
}

const Sidebar: React.FC<SidebarProps> = ({
  files,
  activeFilename,
  onFileSelect,
  history,
  onLoadProject,
  onNewChat,
  onDeleteProject,
  onToggleFavorite,
  currentProjectId,
  searchQuery,
  onSearchChange,
  theme,
  onOpenDevOpsGallery,
  userPlan = 'FREE'
}) => {
  const filenames = Object.keys(files);
  const t = themes[theme];
  const isPro = userPlan !== 'FREE' && userPlan !== undefined;
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return { date: `${day}/${month}/${year}`, time: `${hours}:${minutes}:${seconds}` };
  };

  const { date, time } = formatDateTime(currentTime);

  return (
    <div className="w-64 flex flex-col h-full transition-colors duration-200" style={{ backgroundColor: t.sidebar, borderRight: `1px solid ${t.border}` }}>
      {/* Header */}
      <div className="p-4 space-y-3" style={{ borderBottom: `1px solid ${t.border}` }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: t.accent }}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <div className="text-base font-bold" style={{ color: t.textPrimary }}>Terra.Ai</div>
            <div className="text-xs font-medium" style={{ color: t.textSecondary }}>Cloud Architect</div>
          </div>
        </div>
        <button
          onClick={onNewChat}
          className="w-full font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm hover:scale-105"
          style={{ backgroundColor: t.premium, color: 'white', boxShadow: `0 2px 8px ${t.premium}40` }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Project
        </button>
        <button
          onClick={onOpenDevOpsGallery}
          className="relative w-full font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm hover:scale-105"
          style={{ color: isPro ? t.textPrimary : t.premium, backgroundColor: t.hover, border: `1px solid ${isPro ? t.border : t.premium}30` }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          DevOps Projects
          {!isPro && (
            <svg className="w-4 h-4 absolute -top-1 -right-1" style={{ color: '#FBBF24', filter: 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.5))' }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          )}
        </button>
      </div>

      {/* Search */}
      <div className="p-4" style={{ borderBottom: `1px solid ${t.border}` }}>
        <div className="relative">
          <svg className="w-4 h-4 absolute left-3 top-3" style={{ color: t.textSecondary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none transition-all duration-200"
            style={{ backgroundColor: t.input, border: `1px solid ${t.border}`, color: t.textPrimary }}
            onFocus={(e) => e.currentTarget.style.borderColor = t.accent}
            onBlur={(e) => e.currentTarget.style.borderColor = t.border}
          />
        </div>
      </div>

      {/* Files */}
      {filenames.length > 0 && (
        <div className="p-4" style={{ borderBottom: `1px solid ${t.border}` }}>
          <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: t.textSecondary }}>Files</div>
          <div className="space-y-1">
            {filenames.map((name) => (
              <button
                key={name}
                onClick={() => onFileSelect(name)}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-3"
                style={{
                  backgroundColor: activeFilename === name ? `${t.accent}15` : 'transparent',
                  color: activeFilename === name ? t.accent : t.textPrimary,
                  borderLeft: activeFilename === name ? `3px solid ${t.accent}` : '3px solid transparent'
                }}
                onMouseEnter={(e) => {
                  if (activeFilename !== name) {
                    e.currentTarget.style.backgroundColor = t.hover;
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeFilename !== name) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Live DateTime */}
      <div className="px-4 py-3" style={{ borderBottom: `1px solid ${t.border}` }}>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5" style={{ color: t.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-semibold" style={{ color: t.textPrimary }}>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5" style={{ color: t.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-mono font-bold" style={{ color: t.accent }}>{time}</span>
          </div>
        </div>
      </div>

      {/* Projects */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: t.textSecondary }}>Projects</div>
        <div className="space-y-2">
          {history.length === 0 ? (
            <div className="text-sm text-center py-12" style={{ color: t.textSecondary }}>No projects yet</div>
          ) : (
            history.map((project) => (
              <div
                key={project.id}
                className="group rounded-xl p-3 transition-all duration-200"
                style={{
                  backgroundColor: project.id === currentProjectId ? `${t.accent}10` : t.card,
                  border: `1px solid ${project.id === currentProjectId ? t.accent : t.border}`
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <button
                    onClick={() => onLoadProject(project.id)}
                    className="flex-1 text-left"
                  >
                    <div className="text-sm font-semibold mb-1 line-clamp-1" style={{ color: t.textPrimary }}>
                      {project.title}
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: t.textSecondary }}>
                      <span>{formatDate(project.timestamp)}</span>
                      <span className="px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${t.accent}20`, color: t.accent }}>
                        {Object.keys(project.files).length}
                      </span>
                    </div>
                  </button>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onToggleFavorite(project.dbId!, project.isFavorite || false)}
                      className="p-1.5 rounded-lg transition-all duration-200 hover:scale-110"
                      style={{ color: project.isFavorite ? '#FBBF24' : t.textSecondary, backgroundColor: t.hover }}
                    >
                      <svg className="w-4 h-4" fill={project.isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDeleteProject(project.dbId!)}
                      className="p-1.5 rounded-lg transition-all duration-200 hover:scale-110"
                      style={{ color: '#EF4444', backgroundColor: t.hover }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
