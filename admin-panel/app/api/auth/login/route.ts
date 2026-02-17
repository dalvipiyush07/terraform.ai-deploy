import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    // Hardcoded admin for demo (bypass database)
    if (email === 'admin@terraai.com' && password === 'admin123') {
      const token = signToken({ id: 1, email: 'admin@terraai.com', role: 'super_admin' })
      
      return NextResponse.json({
        token,
        admin: { id: 1, email: 'admin@terraai.com', name: 'Super Admin', role: 'super_admin' }
      })
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
