import { NextRequest, NextResponse } from 'next/server'

// Constants
const AUTH_COOKIE_NAME = '__session' // Firebase Auth session cookie
const ROUTES = {
  HOME: '/',
  NOTES: '/notes',
  MY_NOTEBOOK: '/me',
  ACCOUNT: '/account',
} as const

// Routes that require authentication (anonymous or regular)
const protectedRoutes = [ROUTES.MY_NOTEBOOK]
// Routes that require regular (non-anonymous) users only
const accountOnlyRoutes = [ROUTES.ACCOUNT]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Generate nonce for CSP
  const nonce = crypto.randomUUID()

  // Pass nonce to the app via request headers (Next.js CSP guide)
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)

  // Prepare response with updated request headers
  const response = NextResponse.next({ request: { headers: requestHeaders } })

  // Environment detection using VERCEL_ENV (like reference)
  const vercelEnv = process.env.VERCEL_ENV as string | undefined
  const appEnv = process.env.APP_ENV || process.env.NODE_ENV
  const isProd = vercelEnv === 'production' || appEnv === 'production'
  const isPreview = vercelEnv === 'preview'
  const isStaging = appEnv === 'staging'
  const isDev = appEnv === 'development' && !vercelEnv
  const applyCsp = isProd || isPreview || isStaging
  
  // Route-based authentication headers
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAccountRoute = accountOnlyRoutes.some(route => pathname.startsWith(route))
  
  // Authentication status headers (following reference pattern)
  if (isProtectedRoute) {
    const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME)
    if (!sessionCookie) {
      response.headers.set('x-auth-required', 'true')
    } else {
      response.headers.set('x-verify-auth', 'required')
    }
  }
  
  if (isAccountRoute) {
    response.headers.set('x-account-required', 'true')
  }

  // Build CSP connect-src with environment-specific URLs (following reference pattern)
  const publicApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  const serverApiUrl = process.env.API_BASE_URL
  const publicWebSocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL

  const toWs = (url: string) =>
    url.startsWith('https:') ? url.replace('https:', 'wss:') : url.replace('http:', 'ws:')

  const connectSources: string[] = ["'self'"]
  
  // Firebase Auth domains
  connectSources.push(
    'https://*.firebaseapp.com',
    'https://identitytoolkit.googleapis.com',
    'https://*.googleapis.com'
  )
  
  // Environment-specific API endpoints
  if (publicApiUrl) connectSources.push(publicApiUrl, toWs(publicApiUrl))
  if (serverApiUrl) connectSources.push(serverApiUrl, toWs(serverApiUrl))
  if (publicWebSocketUrl) connectSources.push(publicWebSocketUrl)
  
  // Development-specific sources
  if (isDev) {
    connectSources.push('ws:', 'wss:', 'http://localhost:8000', 'http://localhost:9099')
  }
  
  const connectSrc = connectSources.join(' ')

  // Apply CSP only in production/preview/staging (like reference)
  if (applyCsp) {
    const scriptSrc = [
      "'self'",
      `'nonce-${nonce}'`,
      "'strict-dynamic'",
      ...(isDev ? ["'unsafe-eval'"] : []), // Needed for react-refresh in dev
    ].join(' ')

    const csp = [
      "default-src 'self'",
      `script-src ${scriptSrc}`,
      `connect-src ${connectSrc}`,
      "img-src 'self' data:",
      "style-src 'self' 'unsafe-inline'", // Needed for Tailwind
      "font-src 'self'",
      "frame-src https://vercel.live", // Required for Vercel deployment
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
    ].join('; ')

    response.headers.set('Content-Security-Policy', csp)
  }
  
  response.headers.set('X-Nonce', nonce)

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - mockServiceWorker.js (MSW for testing)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|mockServiceWorker.js).*)',
  ],
}
