import React from 'react';
import { TerraformFiles } from '../types';
import { themes, Theme, getStoredTheme } from '../theme';

interface EditorProps {
  files: TerraformFiles;
  activeFilename: string;
  onFileSelect: (filename: string) => void;
  isStreaming: boolean;
}

const Editor: React.FC<EditorProps> = ({ files, activeFilename, onFileSelect, isStreaming }) => {
  const filenames = Object.keys(files);
  const currentCode = files[activeFilename] || '';
  const cleanCode = currentCode.replace(/```hcl|```terraform|```/g, '').trim();
  const theme = getStoredTheme();
  const t = themes[theme];

  return (
    <div className="flex-1 flex flex-col overflow-hidden transition-colors duration-200" style={{ backgroundColor: t.bg }}>
      {/* Tabs */}
      <div className="flex items-center h-12 px-3 gap-1 overflow-x-auto transition-colors duration-200" style={{ backgroundColor: t.sidebar, borderBottom: `1px solid ${t.border}` }}>
        {filenames.length > 0 ? filenames.map((name) => (
          <button
            key={name}
            onClick={() => onFileSelect(name)}
            className="px-4 h-9 flex items-center gap-2 text-sm font-medium transition-all duration-200 rounded-t-lg whitespace-nowrap"
            style={{
              backgroundColor: activeFilename === name ? t.bg : 'transparent',
              color: activeFilename === name ? t.accent : t.textSecondary,
              borderBottom: activeFilename === name ? `2px solid ${t.accent}` : '2px solid transparent'
            }}
            onMouseEnter={(e) => {
              if (activeFilename !== name) {
                e.currentTarget.style.backgroundColor = t.hover;
                e.currentTarget.style.color = t.textPrimary;
              }
            }}
            onMouseLeave={(e) => {
              if (activeFilename !== name) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = t.textSecondary;
              }
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {name}
          </button>
        )) : (
          <div className="px-4 text-xs font-medium flex items-center h-full" style={{ color: t.textSecondary }}>
            No files open
          </div>
        )}
        
        {filenames.length > 0 && !isStreaming && (
          <div className="ml-auto pr-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ backgroundColor: '#3FB95020', border: '1px solid #3FB95030', color: '#3FB950' }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#3FB950' }}></div>
              Ready
            </div>
          </div>
        )}
      </div>
      
      {/* Editor */}
      <div className="flex-1 overflow-auto custom-scrollbar transition-colors duration-200" style={{ backgroundColor: t.bg }}>
        {filenames.length > 0 ? (
          <div className="flex min-h-full">
            {/* Line Numbers */}
            <div className="w-14 flex flex-col items-end pr-4 pt-4 select-none sticky left-0 z-10 transition-colors duration-200" style={{ backgroundColor: t.bg, borderRight: `1px solid ${t.border}` }}>
              {cleanCode.split('\n').map((_, i) => (
                <span key={i} className="text-xs leading-6 font-mono" style={{ color: t.textSecondary }}>{i + 1}</span>
              ))}
            </div>
            
            {/* Code */}
            <div className="flex-1 p-4 pt-4 code-font text-sm leading-6">
              <pre className="whitespace-pre" style={{ color: t.textPrimary }}>
                {cleanCode.split('\n').map((line, i) => (
                  <div key={i} className="px-2 -mx-2 rounded transition-colors duration-200" style={{ ':hover': { backgroundColor: t.hover } }}>
                    {line || ' '}
                  </div>
                ))}
                {isStreaming && (
                  <span className="inline-block w-2 h-4 animate-pulse ml-1 align-middle" style={{ backgroundColor: t.accent }} />
                )}
              </pre>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center mb-6" style={{ borderColor: t.border }}>
              <svg className="w-10 h-10" style={{ color: t.textSecondary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2" style={{ color: t.textPrimary }}>No file selected</h2>
            <p className="text-sm max-w-xs" style={{ color: t.textSecondary }}>Start a new project or select a file from the sidebar to begin editing</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;
