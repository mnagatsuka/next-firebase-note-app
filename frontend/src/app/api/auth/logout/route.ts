import { NextRequest, NextResponse } from 'next/server'
import { serverEnv } from '@/lib/config/env'

export const runtime = 'nodejs'

export async function POST(_request: NextRequest) {
  const res = NextResponse.json({ success: true })
  // Clear session cookie
  res.cookies.set('__session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })

  // Inform backend (best-effort) to clear any server state
  const apiBase = serverEnv?.API_BASE_URL || 'http://backend:8000'
  try {
    await fetch(`${apiBase}/auth/logout`, { method: 'POST' })
  } catch (_) {}

  return res
}

