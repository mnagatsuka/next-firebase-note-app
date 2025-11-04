import type { NextConfig } from 'next'

const appEnv = process.env.APP_ENV
const isProd = appEnv === 'production'
const isStaging = appEnv === 'staging'

// Comprehensive security headers per specification
const securityHeaders = [
  // HSTS - production only
  ...(isProd || isStaging
    ? [{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }]
    : []),
  // Prevent MIME type sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Prevent clickjacking
  { key: 'X-Frame-Options', value: 'DENY' },
  // Control referrer information
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Permissions policy for additional security
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

const nextConfig: NextConfig = {
  // Disable ESLint during builds for faster CI/CD
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Enable React strict mode
  reactStrictMode: true,
  
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
  
}

export default nextConfig