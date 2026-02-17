'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('admin_token')
    if (token && window.location.pathname === '/') {
      window.location.href = '/dashboard'
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error)

      localStorage.setItem('admin_token', data.token)
      localStorage.setItem('admin_user', JSON.stringify(data.admin))
      
      // Force redirect
      window.location.href = '/dashboard'
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e1525]">
      <div className="max-w-md w-full">
        <div className="bg-[#1c2333] border border-[#21262d] rounded-lg p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#FF9900] rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#f0f6fc] mb-2">Terra.Ai Admin</h1>
            <p className="text-[#8b949e] text-sm">Sign in to admin panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-medium text-[#8b949e] mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-[#0d1117] border border-[#21262d] text-[#f0f6fc] rounded-lg focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#8b949e] mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-[#0d1117] border border-[#21262d] text-[#f0f6fc] rounded-lg focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
                required
              />
            </div>

            {error && (
              <div className="bg-[#f85149]/10 border border-[#f85149]/30 text-[#f85149] px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#FF9900] hover:bg-[#ff8800] text-white font-medium py-3 rounded-lg transition-colors"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-[#8b949e]">
            Admin access only • Secure authentication
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="bg-[#1c2333] border border-[#21262d] rounded-lg p-4">
            <h3 className="text-sm font-semibold text-[#f0f6fc] mb-2">Admin Panel Features</h3>
            <ul className="text-xs text-[#8b949e] space-y-2 text-left">
              <li className="flex items-center gap-2">
                <span className="text-[#3fb950]">✓</span>
                Real-time user & project monitoring
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#3fb950]">✓</span>
                AWS infrastructure analytics
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#3fb950]">✓</span>
                Content management system
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#3fb950]">✓</span>
                Activity logs & monitoring
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
