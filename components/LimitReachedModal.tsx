import React from 'react';
import { themes, Theme } from '../theme';

interface LimitReachedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  theme: Theme;
  userPlan: 'FREE' | 'MONTHLY' | 'SIXMONTHS' | 'YEARLY';
}

const LimitReachedModal: React.FC<LimitReachedModalProps> = ({ isOpen, onClose, onUpgrade, theme, userPlan }) => {
  const t = themes[theme];

  if (!isOpen) return null;

  const getLimitMessage = () => {
    if (userPlan === 'FREE') {
      return {
        title: 'Daily Limit Reached!',
        message: 'FREE users can create only 5 projects per day.',
        upgrade: 'Upgrade to create more projects'
      };
    } else if (userPlan === 'MONTHLY') {
      return {
        title: 'Daily Limit Reached!',
        message: 'Monthly plan allows 20 projects per day.',
        upgrade: 'Upgrade to 6 months or yearly for unlimited projects'
      };
    }
    return {
      title: 'Limit Reached',
      message: 'You have reached your daily limit.',
      upgrade: 'Upgrade your plan'
    };
  };

  const { title, message, upgrade } = getLimitMessage();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
      <div 
        className="max-w-md w-full rounded-2xl p-8 animate-in fade-in zoom-in duration-300"
        style={{ backgroundColor: t.card, border: `1px solid ${t.border}`, boxShadow: `0 20px 60px ${t.shadow}` }}
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: `${t.premium}15`, border: `2px solid ${t.premium}` }}>
            <svg className="w-10 h-10" style={{ color: t.premium }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-3" style={{ color: t.textPrimary }}>
          {title}
        </h2>

        {/* Message */}
        <p className="text-center mb-2" style={{ color: t.textSecondary }}>
          {message}
        </p>
        <p className="text-center text-sm font-semibold mb-8" style={{ color: t.accent }}>
          {upgrade}
        </p>

        {/* Features */}
        <div className="rounded-xl p-4 mb-6" style={{ backgroundColor: t.hover, border: `1px solid ${t.border}` }}>
          <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: t.textSecondary }}>
            Upgrade Benefits:
          </div>
          <div className="space-y-2">
            {[
              userPlan === 'FREE' ? '20 projects/day (Monthly)' : 'Unlimited projects (6 months/yearly)',
              'Access to DevOps Projects',
              'Priority support',
              'Advanced features'
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" style={{ color: t.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm" style={{ color: t.textPrimary }}>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105"
            style={{ color: t.textSecondary, backgroundColor: t.hover, border: `1px solid ${t.border}` }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onClose();
              onUpgrade();
            }}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:scale-105"
            style={{ backgroundColor: t.premium, boxShadow: `0 4px 16px ${t.premium}40` }}
          >
            Upgrade Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default LimitReachedModal;
