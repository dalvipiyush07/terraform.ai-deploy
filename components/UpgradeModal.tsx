import React from 'react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  onOpenPricing: () => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, theme, onOpenPricing }) => {
  if (!isOpen) return null;

  const isDark = theme === 'dark';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      style={{ 
        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(8px)'
      }}
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200"
        style={{ 
          backgroundColor: isDark ? '#111827' : '#FFFFFF',
          border: `1px solid ${isDark ? '#1F2937' : '#E5E7EB'}`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Crown Icon */}
        <div className="flex justify-center pt-8 pb-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ 
            backgroundColor: 'rgba(251, 191, 36, 0.1)',
            boxShadow: '0 0 20px rgba(251, 191, 36, 0.3)'
          }}>
            <svg className="w-8 h-8" style={{ color: '#FBBF24' }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 pb-8 text-center">
          <h2 className="text-2xl font-bold mb-2" style={{ color: isDark ? '#E5E7EB' : '#111827' }}>
            Unlock DevOps Projects
          </h2>
          <p className="mb-6" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
            Upgrade to Terra.Ai Pro to manage advanced DevOps workflows.
          </p>

          {/* Features */}
          <div className="space-y-3 mb-8 text-left">
            {[
              { icon: '🔗', text: 'Multi-repo linking' },
              { icon: '⚡', text: 'CI/CD integrations' },
              { icon: '🌍', text: 'Environment management' },
              { icon: '👥', text: 'Team collaboration' }
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{ 
                backgroundColor: isDark ? '#1F2937' : '#F9FAFB' 
              }}>
                <span className="text-2xl">{feature.icon}</span>
                <span className="font-medium" style={{ color: isDark ? '#E5E7EB' : '#111827' }}>
                  {feature.text}
                </span>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => {
                onClose();
                onOpenPricing();
              }}
              className="w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 hover:scale-[0.98]"
              style={{ 
                backgroundColor: '#FF9900',
                boxShadow: '0 4px 12px rgba(255, 153, 0, 0.3)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E68A00'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF9900'}
            >
              Upgrade to Pro
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 px-6 rounded-lg font-medium transition-all duration-200"
              style={{ 
                color: isDark ? '#9CA3AF' : '#6B7280',
                backgroundColor: isDark ? '#1F2937' : '#F3F4F6'
              }}
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
