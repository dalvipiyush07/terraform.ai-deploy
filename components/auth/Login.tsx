import React, { useState } from 'react';

interface LoginProps {
  onLogin: (token: string, user: any) => void;
  onSwitchToSignup: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin(data.token, data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e1525] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#1c2333] border border-[#21262d] rounded-lg p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#58a6ff] rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#f0f6fc] mb-2">Welcome back</h1>
            <p className="text-[#8b949e] text-sm">Sign in to CloudArchitect IDE</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#8b949e] mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0d1117] border border-[#21262d] rounded-md px-3 py-2 text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#8b949e] mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0d1117] border border-[#21262d] rounded-md px-3 py-2 text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]"
                required
              />
            </div>

            {error && (
              <div className="bg-[#f85149]/10 border border-[#f85149]/30 rounded-md px-3 py-2 text-[#f85149] text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#58a6ff] hover:bg-[#79c0ff] disabled:bg-[#21262d] disabled:text-[#8b949e] text-white font-medium py-2 rounded-md transition-all"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={onSwitchToSignup}
              className="text-[#58a6ff] hover:text-[#79c0ff] text-sm font-medium"
            >
              Don't have an account? Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
