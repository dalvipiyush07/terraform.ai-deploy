import React, { useState, useEffect } from 'react';
import App from './App';
import GoogleAuth from './components/auth/GoogleAuth';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsConditions from './components/TermsConditions';
import Footer from './components/Footer';

const Main: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<'app' | 'privacy' | 'terms' | 'refund' | 'disclaimer' | 'contact'>('app');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  if (currentPage === 'privacy') {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <button 
          onClick={() => setCurrentPage('app')}
          className="fixed top-4 left-4 z-50 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
        >
          ← Back
        </button>
        <div className="flex-1 overflow-y-auto">
          <PrivacyPolicy />
        </div>
        <Footer 
          onPrivacyClick={() => setCurrentPage('privacy')}
          onTermsClick={() => setCurrentPage('terms')}
          onRefundClick={() => setCurrentPage('refund')}
          onDisclaimerClick={() => setCurrentPage('disclaimer')}
          onContactClick={() => setCurrentPage('contact')}
        />
      </div>
    );
  }

  if (currentPage === 'terms') {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <button 
          onClick={() => setCurrentPage('app')}
          className="fixed top-4 left-4 z-50 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
        >
          ← Back
        </button>
        <div className="flex-1 overflow-y-auto">
          <TermsConditions />
        </div>
        <Footer 
          onPrivacyClick={() => setCurrentPage('privacy')}
          onTermsClick={() => setCurrentPage('terms')}
          onRefundClick={() => setCurrentPage('refund')}
          onDisclaimerClick={() => setCurrentPage('disclaimer')}
          onContactClick={() => setCurrentPage('contact')}
        />
      </div>
    );
  }

  if (currentPage === 'refund') {
    return (
      <div className="flex flex-col min-h-screen">
        <button 
          onClick={() => setCurrentPage('app')}
          className="fixed top-4 left-4 z-50 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
        >
          ← Back
        </button>
        <div className="flex-1 bg-[#0b0e14] text-[#c9d1d9] py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-black text-white mb-8">Refund Policy</h1>
            <p className="text-slate-300">Coming soon...</p>
          </div>
        </div>
        <Footer 
          onPrivacyClick={() => setCurrentPage('privacy')}
          onTermsClick={() => setCurrentPage('terms')}
          onRefundClick={() => setCurrentPage('refund')}
          onDisclaimerClick={() => setCurrentPage('disclaimer')}
          onContactClick={() => setCurrentPage('contact')}
        />
      </div>
    );
  }

  if (currentPage === 'disclaimer') {
    return (
      <div className="flex flex-col min-h-screen">
        <button 
          onClick={() => setCurrentPage('app')}
          className="fixed top-4 left-4 z-50 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
        >
          ← Back
        </button>
        <div className="flex-1 bg-[#0b0e14] text-[#c9d1d9] py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-black text-white mb-8">Disclaimer</h1>
            <p className="text-slate-300">Coming soon...</p>
          </div>
        </div>
        <Footer 
          onPrivacyClick={() => setCurrentPage('privacy')}
          onTermsClick={() => setCurrentPage('terms')}
          onRefundClick={() => setCurrentPage('refund')}
          onDisclaimerClick={() => setCurrentPage('disclaimer')}
          onContactClick={() => setCurrentPage('contact')}
        />
      </div>
    );
  }

  if (currentPage === 'contact') {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <button 
          onClick={() => setCurrentPage('app')}
          className="fixed top-4 left-4 z-50 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
        >
          ← Back
        </button>
        <div className="flex-1 overflow-y-auto bg-[#0b0e14] text-[#c9d1d9] py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-black text-white mb-8">Contact Us</h1>
            <div className="text-slate-300 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-blue-400 mb-3">Email</h3>
                <p><a href="mailto:pm.terra.ai@gmail.com" className="text-blue-400 hover:underline text-lg">pm.terra.ai@gmail.com</a></p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-400 mb-3">Instagram</h3>
                <p><a href="https://www.instagram.com/pm.terra.ai?igsh=MmU1dHJuOHdlejI1" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-lg">@pm.terra.ai</a></p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-400 mb-3">LinkedIn</h3>
                <p><a href="https://www.linkedin.com/in/terra-ai-62a0563b0" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-lg">Terra AI on LinkedIn</a></p>
              </div>
            </div>
          </div>
        </div>
        <Footer 
          onPrivacyClick={() => setCurrentPage('privacy')}
          onTermsClick={() => setCurrentPage('terms')}
          onRefundClick={() => setCurrentPage('refund')}
          onDisclaimerClick={() => setCurrentPage('disclaimer')}
          onContactClick={() => setCurrentPage('contact')}
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1">
          <GoogleAuth />
        </div>
        <Footer 
          onPrivacyClick={() => setCurrentPage('privacy')}
          onTermsClick={() => setCurrentPage('terms')}
          onRefundClick={() => setCurrentPage('refund')}
          onDisclaimerClick={() => setCurrentPage('disclaimer')}
          onContactClick={() => setCurrentPage('contact')}
        />
      </div>
    );
  }

  return (
    <div>
      <App user={user} onLogout={handleLogout} onNavigate={(page) => setCurrentPage(page as any)} />
      <Footer 
        onPrivacyClick={() => setCurrentPage('privacy')}
        onTermsClick={() => setCurrentPage('terms')}
        onRefundClick={() => setCurrentPage('refund')}
        onDisclaimerClick={() => setCurrentPage('disclaimer')}
        onContactClick={() => setCurrentPage('contact')}
      />
    </div>
  );
};

export default Main;
