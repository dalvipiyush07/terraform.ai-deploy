import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onLogout: () => void;
  theme: 'dark' | 'light';
  onThemeChange: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, user, onLogout, theme, onThemeChange }) => {
  const [userStats, setUserStats] = useState({ totalProjects: 0, favoriteProjects: 0 });

  useEffect(() => {
    if (isOpen) {
      loadStats();
    }
  }, [isOpen]);

  const loadStats = async () => {
    try {
      const projects = await authService.getProjects();
      setUserStats({
        totalProjects: projects.length,
        favoriteProjects: projects.filter((p: any) => p.is_favorite === 1).length
      });
    } catch (err) {
      console.error('Failed to load stats', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-[#1c2333] border border-[#21262d] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#21262d]">
          <h2 className="text-lg font-semibold text-[#f0f6fc]">Settings</h2>
          <button onClick={onClose} className="text-[#8b949e] hover:text-[#f0f6fc] p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* User Profile */}
          <div>
            <h3 className="text-sm font-semibold text-[#8b949e] uppercase tracking-wider mb-3">Profile</h3>
            <div className="bg-[#0d1117] border border-[#21262d] rounded-lg p-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-[#58a6ff] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-[#f0f6fc] font-semibold text-lg">{user?.name}</div>
                  <div className="text-[#8b949e] text-sm">{user?.email}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1c2333] border border-[#21262d] rounded-md p-3">
                  <div className="text-[#8b949e] text-xs mb-1">Total Projects</div>
                  <div className="text-[#f0f6fc] text-2xl font-bold">{userStats.totalProjects}</div>
                </div>
                <div className="bg-[#1c2333] border border-[#21262d] rounded-md p-3">
                  <div className="text-[#8b949e] text-xs mb-1">Favorites</div>
                  <div className="text-[#f0f6fc] text-2xl font-bold">{userStats.favoriteProjects}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div>
            <h3 className="text-sm font-semibold text-[#8b949e] uppercase tracking-wider mb-3">Appearance</h3>
            <div className="bg-[#0d1117] border border-[#21262d] rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[#f0f6fc] font-medium mb-1">Theme</div>
                  <div className="text-[#8b949e] text-sm">Choose your preferred theme</div>
                </div>
                <button
                  onClick={onThemeChange}
                  className="bg-[#1c2333] border border-[#21262d] rounded-md px-4 py-2 text-[#f0f6fc] hover:bg-[#161b22] transition-all flex items-center gap-2"
                >
                  {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
                </button>
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div>
            <h3 className="text-sm font-semibold text-[#8b949e] uppercase tracking-wider mb-3">Account</h3>
            <div className="bg-[#0d1117] border border-[#21262d] rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-[#21262d]">
                <span className="text-[#8b949e] text-sm">User ID</span>
                <span className="text-[#f0f6fc] text-sm font-mono">{user?.id}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#21262d]">
                <span className="text-[#8b949e] text-sm">Account Type</span>
                <span className="px-2 py-1 bg-[#58a6ff]/10 text-[#58a6ff] rounded text-xs font-medium">{user?.plan || 'FREE'}</span>
              </div>
              {user?.planExpiry && user?.plan !== 'FREE' && (
                <div className="flex items-center justify-between py-2 border-b border-[#21262d]">
                  <span className="text-[#8b949e] text-sm">Plan Expiry</span>
                  <span className="text-[#f0f6fc] text-sm font-mono">{new Date(user.planExpiry).toLocaleDateString('en-GB')}</span>
                </div>
              )}
              <div className="flex items-center justify-between py-2">
                <span className="text-[#8b949e] text-sm">Member Since</span>
                <span className="text-[#f0f6fc] text-sm font-mono">{user?.created_at ? new Date(user.created_at).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB')}</span>
              </div>
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-[#8b949e] uppercase tracking-wider mb-3">About</h3>
            <div className="bg-[#0d1117] border border-[#21262d] rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#58a6ff] rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[#f0f6fc] font-semibold">Terra.ai</div>
                  <div className="text-[#8b949e] text-xs">Version 1.0.0</div>
                </div>
              </div>
              <p className="text-[#8b949e] text-sm">
                AI-powered Terraform code generator for AWS infrastructure. Build, deploy, and manage cloud architectures with AI assistance.
              </p>
            </div>
          </div>

          {/* Danger Zone */}
          <div>
            <h3 className="text-sm font-semibold text-[#f85149] uppercase tracking-wider mb-3">Danger Zone</h3>
            <div className="bg-[#0d1117] border border-[#f85149]/30 rounded-lg p-4">
              <button
                onClick={onLogout}
                className="w-full bg-[#f85149]/10 hover:bg-[#f85149]/20 border border-[#f85149]/30 text-[#f85149] font-medium py-2 px-4 rounded-md transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
