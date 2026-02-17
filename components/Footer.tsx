import React from 'react';

interface FooterProps {
  onPrivacyClick: () => void;
  onTermsClick: () => void;
  onRefundClick: () => void;
  onDisclaimerClick: () => void;
  onContactClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onPrivacyClick, onTermsClick, onRefundClick, onDisclaimerClick, onContactClick }) => {
  return (
    <footer className="bg-[#0b0e14] border-t border-[#30363d] py-6 text-center">
      <div className="text-slate-500 text-sm">
        <p className="mb-3">© 2025 Terra.ai</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <button onClick={onPrivacyClick} className="hover:text-blue-400 transition-colors">Privacy Policy</button>
          <span>|</span>
          <button onClick={onTermsClick} className="hover:text-blue-400 transition-colors">Terms & Conditions</button>
          <span>|</span>
          <button onClick={onRefundClick} className="hover:text-blue-400 transition-colors">Refund Policy</button>
          <span>|</span>
          <button onClick={onDisclaimerClick} className="hover:text-blue-400 transition-colors">Disclaimer</button>
          <span>|</span>
          <button onClick={onContactClick} className="hover:text-blue-400 transition-colors">Contact</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
