import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase/admin'
import { serverEnv } from '@/lib/config/env'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization') || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) {
    return NextResponse.json({ error: 'Missing ID token' }, { status: 401 })
  }

  try {
    // Create session cookie (14 days)
    const expiresIn = (serverEnv?.SESSION_COOKIE_MAX_AGE ?? 14 * 24 * 60 * 60) * 1000
    const sessionCookie = await adminAuth().createSessionCookie(token, { expiresIn })

    const res = NextResponse.json({ success: true })
    res.cookies.set('__session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: expiresIn / 1000,
      path: '/',
    })

    // Optionally inform backend for DB insert
    const apiBase = serverEnv?.API_BASE_URL || 'http://backend:8000'
    try {
      await fetch(`${apiBase}/auth/anonymous`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
    } catch (_) {
      // Best-effort; DB sync handled by backend on subsequent requests.
    }

    return res
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create session' }, { status: 401 })
  }
}

