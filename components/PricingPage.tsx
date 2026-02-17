import React, { useState } from 'react';
import { themes, Theme } from '../theme';
import { authService } from '../services/authService';

interface PricingPageProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  user: any;
}

const PricingPage: React.FC<PricingPageProps> = ({ isOpen, onClose, theme, user }) => {
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'sixmonths' | 'yearly'>('monthly');
  const [transactionId, setTransactionId] = useState('');
  const t = themes[theme];
  const upiId = import.meta.env.VITE_UPI_ID || '9172326283-2@ybl';

  if (!isOpen) return null;

  const plans = {
    monthly: { price: '₹99', period: '/month', total: '₹99', amount: 99, apiPlan: 'MONTHLY', features: '20 projects/day' },
    sixmonths: { price: '₹499', period: '/6 months', total: '₹499', amount: 499, save: 'Save ₹95', apiPlan: 'SIXMONTHS', features: 'Unlimited projects' },
    yearly: { price: '₹999', period: '/year', total: '₹999', amount: 999, save: 'Save ₹189', apiPlan: 'YEARLY', features: 'Unlimited projects' }
  };

  const handleUpgrade = () => {
    setShowPayment(true);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ backgroundColor: t.bg }}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 transition-colors duration-200" style={{ backgroundColor: t.sidebar, borderBottom: `1px solid ${t.border}` }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: t.accent }}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <div className="text-base font-bold" style={{ color: t.textPrimary }}>Terra.Ai Pro</div>
              <div className="text-xs font-medium" style={{ color: t.textSecondary }}>Upgrade your account</div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
            style={{ color: t.textSecondary, backgroundColor: t.hover }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {!showPayment ? (
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ backgroundColor: `${t.accent}15`, border: `1px solid ${t.accent}30` }}>
              <svg className="w-4 h-4" style={{ color: t.accent }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              <span className="text-sm font-semibold" style={{ color: t.accent }}>Limited Time Offer</span>
            </div>
            <h1 className="text-4xl font-bold mb-4" style={{ color: t.textPrimary }}>
              Unlock the Full Power of Terra.Ai
            </h1>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: t.textSecondary }}>
              Get access to advanced DevOps workflows, CI/CD integrations, and team collaboration features.
            </p>
          </div>

          {/* Plan Toggle */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex rounded-xl p-1" style={{ backgroundColor: t.hover, border: `1px solid ${t.border}` }}>
              <button
                onClick={() => setSelectedPlan('monthly')}
                className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
                style={{
                  backgroundColor: selectedPlan === 'monthly' ? t.accent : 'transparent',
                  color: selectedPlan === 'monthly' ? 'white' : t.textSecondary
                }}
              >
                Monthly
              </button>
              <button
                onClick={() => setSelectedPlan('sixmonths')}
                className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 relative"
                style={{
                  backgroundColor: selectedPlan === 'sixmonths' ? t.accent : 'transparent',
                  color: selectedPlan === 'sixmonths' ? 'white' : t.textSecondary
                }}
              >
                6 Months
                <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: '#3FB950', color: 'white' }}>
                  -16%
                </span>
              </button>
              <button
                onClick={() => setSelectedPlan('yearly')}
                className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 relative"
                style={{
                  backgroundColor: selectedPlan === 'yearly' ? t.accent : 'transparent',
                  color: selectedPlan === 'yearly' ? 'white' : t.textSecondary
                }}
              >
                Yearly
                <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: '#3FB950', color: 'white' }}>
                  -19%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="max-w-md mx-auto mb-12">
            <div className="rounded-2xl p-8 transition-all duration-200" style={{ backgroundColor: t.card, border: `2px solid ${t.accent}`, boxShadow: `0 8px 32px ${t.shadow}` }}>
              <div className="text-center mb-6">
                <div className="text-5xl font-bold mb-2" style={{ color: t.textPrimary }}>
                  {plans[selectedPlan].price}
                </div>
                <div className="text-lg font-medium" style={{ color: t.textSecondary }}>
                  {plans[selectedPlan].period}
                </div>
                {selectedPlan === 'yearly' && (
                  <div className="mt-2 text-sm font-semibold" style={{ color: '#3FB950' }}>
                    {plans[selectedPlan].save}
                  </div>
                )}
              </div>

              <button
                onClick={handleUpgrade}
                className="w-full py-4 rounded-xl font-bold text-lg text-white transition-all duration-200 hover:scale-105 mb-6"
                style={{ backgroundColor: '#FF9900', boxShadow: '0 4px 16px rgba(255, 153, 0, 0.4)' }}
              >
                Upgrade to Pro
              </button>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 flex-shrink-0" style={{ color: t.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium" style={{ color: t.textPrimary }}>{plans[selectedPlan].features}</span>
                </div>
                {[
                  selectedPlan === 'monthly' ? '5 DevOps Projects' : 'Unlimited DevOps Projects',
                  'Multi-repo linking',
                  'CI/CD integrations',
                  'Environment management',
                  'Team collaboration',
                  'Priority support',
                  'Advanced analytics'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <svg className="w-5 h-5 flex-shrink-0" style={{ color: t.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm font-medium" style={{ color: t.textPrimary }}>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="text-center">
            <p className="text-sm font-medium mb-4" style={{ color: t.textSecondary }}>
              Trusted by 10,000+ cloud engineers worldwide
            </p>
            <div className="flex justify-center gap-4 text-xs" style={{ color: t.textSecondary }}>
              <span>🔒 Secure Payment</span>
              <span>💳 UPI Accepted</span>
              <span>✅ Instant Activation</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto px-6 py-12">
          <div className="rounded-2xl p-8 transition-all duration-200" style={{ backgroundColor: t.card, border: `1px solid ${t.border}`, boxShadow: `0 8px 32px ${t.shadow}` }}>
            {/* Payment Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: `${t.accent}15` }}>
                <svg className="w-8 h-8" style={{ color: t.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: t.textPrimary }}>Complete Your Payment</h2>
              <p className="text-sm" style={{ color: t.textSecondary }}>Pay via UPI to activate Terra.Ai Pro</p>
            </div>

            {/* Order Summary */}
            <div className="rounded-xl p-4 mb-6" style={{ backgroundColor: t.hover, border: `1px solid ${t.border}` }}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium" style={{ color: t.textSecondary }}>Terra.Ai Pro ({selectedPlan})</span>
                <span className="text-lg font-bold" style={{ color: t.textPrimary }}>{plans[selectedPlan].price}</span>
              </div>
              <div className="flex justify-between items-center text-xs" style={{ color: t.textSecondary }}>
                <span>Billed {selectedPlan}</span>
                <span>Instant activation</span>
              </div>
            </div>

            {/* UPI Payment */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: t.textPrimary }}>
                  Pay via UPI
                </label>
                <div className="rounded-xl p-6 text-center" style={{ backgroundColor: t.hover, border: `2px dashed ${t.border}` }}>
                  <div className="w-48 h-48 mx-auto mb-4 rounded-xl overflow-hidden" style={{ backgroundColor: 'white' }}>
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${upiId}&pn=TerraAi&cu=INR&am=${plans[selectedPlan].amount}`}
                      alt="UPI QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-sm font-semibold mb-2" style={{ color: t.textPrimary }}>
                    Scan QR Code with any UPI app
                  </div>
                  <div className="flex justify-center gap-2 mb-4">
                    <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: t.card, color: t.textSecondary }}>Google Pay</span>
                    <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: t.card, color: t.textSecondary }}>PhonePe</span>
                    <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: t.card, color: t.textSecondary }}>Paytm</span>
                  </div>
                  <div className="text-sm font-semibold mb-2" style={{ color: t.textPrimary }}>
                    Or pay directly to UPI ID:
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-3 rounded-lg" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
                    <span className="text-lg font-bold" style={{ color: t.accent }}>{upiId}</span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(upiId);
                        alert('UPI ID copied!');
                      }}
                      className="p-1 rounded transition-all duration-200 hover:scale-110"
                      style={{ color: t.textSecondary }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: t.textPrimary }}>
                  Transaction ID / UTR Number
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter your transaction ID"
                  className="w-full px-4 py-3 rounded-lg text-sm transition-all duration-200 focus:outline-none"
                  style={{ backgroundColor: t.input, border: `1px solid ${t.border}`, color: t.textPrimary }}
                  onFocus={(e) => e.currentTarget.style.borderColor = t.accent}
                  onBlur={(e) => e.currentTarget.style.borderColor = t.border}
                />
                <p className="text-xs mt-2" style={{ color: t.textSecondary }}>
                  Enter the transaction ID after completing payment
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={async () => {
                if (!transactionId.trim()) {
                  alert('Please enter transaction ID');
                  return;
                }
                try {
                  const token = localStorage.getItem('token');
                  const response = await fetch('http://localhost:5000/api/payment-request', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                      plan: plans[selectedPlan].apiPlan,
                      transactionId: transactionId,
                      amount: plans[selectedPlan].amount
                    })
                  });
                  
                  const data = await response.json();
                  
                  if (data.success) {
                    alert('Payment request submitted! Admin will verify and activate your plan within 24 hours.');
                    onClose();
                  } else {
                    alert('Failed to submit request. Please try again.');
                  }
                } catch (err) {
                  alert('Submission failed. Please contact support.');
                }
              }}
              className="w-full py-4 rounded-xl font-bold text-lg text-white transition-all duration-200 hover:scale-105 mb-4"
              style={{ backgroundColor: '#FF9900', boxShadow: '0 4px 16px rgba(255, 153, 0, 0.4)' }}
            >
              Submit Payment Request
            </button>

            <button
              onClick={() => setShowPayment(false)}
              className="w-full py-3 rounded-xl font-medium text-sm transition-all duration-200"
              style={{ color: t.textSecondary, backgroundColor: t.hover }}
            >
              ← Back to Plans
            </button>

            {/* Help Text */}
            <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: `${t.accent}10`, border: `1px solid ${t.accent}30` }}>
              <p className="text-xs font-medium" style={{ color: t.textSecondary }}>
                💡 <strong>Need help?</strong> Contact pm.terra.ai@gmail.com
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingPage;
