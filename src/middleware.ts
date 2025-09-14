import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Basit IP tabanlı rate limiting (global scope: aynı edge instance'ında paylaşımlı)
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 120
type Counter = { count: number; resetAt: number }
const ipCounters = new Map<string, Counter>()

// Security headers configuration
function addSecurityHeaders(response: NextResponse): NextResponse {
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.sentry-io https://browser.sentry-io https://vercel.live",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https: blob:",
    "media-src 'self' https: blob:",
    "connect-src 'self' https: wss: blob:",
    "frame-src 'self' https://js.sentry-io https://vercel.live",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ')
  
  // Security Headers
  const headers = {
    // Content Security Policy
    'Content-Security-Policy': csp,
    
    // Prevent clickjacking
    'X-Frame-Options': 'DENY',
    
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    
    // Enable XSS protection
    'X-XSS-Protection': '1; mode=block',
    
    // Referrer Policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Permissions Policy (formerly Feature Policy)
    'Permissions-Policy': [
      'camera=()',
      'microphone=()',
      'geolocation=(self)',
      'interest-cohort=()',
      'browsing-topics=()'
    ].join(', '),
    
    // Strict Transport Security (HSTS)
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    
    // Cross-Origin Policies
    'Cross-Origin-Embedder-Policy': 'unsafe-none',
    'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    'Cross-Origin-Resource-Policy': 'cross-origin',
    
    // Additional security headers
    'X-DNS-Prefetch-Control': 'on',
    'X-Download-Options': 'noopen',
    'X-Permitted-Cross-Domain-Policies': 'none'
  }
  
  // Apply headers
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  
  return response
}

// Auth gerektiren route'lar
const protectedRoutes = [
  '/profile',
  '/shop/checkout',
  '/api/user',
  '/api/cart',
  '/api/orders'
]

// Auth'da olanlar erişememeli
const authRoutes = [
  '/login',
  '/register',
  '/forgot-password'
]

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Rate limiting (IP + window)
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  const now = Date.now()
  const key = String(ip)
  const current = ipCounters.get(key)
  if (!current || current.resetAt < now) {
    ipCounters.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
  } else {
    current.count += 1
    if (current.count > RATE_LIMIT_MAX_REQUESTS) {
      const res = NextResponse.json({ 
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil((current.resetAt - now) / 1000)
      }, { status: 429 })
      res.headers.set('Retry-After', Math.ceil((current.resetAt - now) / 1000).toString())
      res.headers.set('X-RateLimit-Limit', RATE_LIMIT_MAX_REQUESTS.toString())
      res.headers.set('X-RateLimit-Remaining', '0')
      res.headers.set('X-RateLimit-Reset', current.resetAt.toString())
      return addSecurityHeaders(res)
    }
  }
  
  // Add rate limit headers to successful requests
  response.headers.set('X-RateLimit-Limit', RATE_LIMIT_MAX_REQUESTS.toString())
  response.headers.set('X-RateLimit-Remaining', (RATE_LIMIT_MAX_REQUESTS - (current?.count || 1)).toString())
  response.headers.set('X-RateLimit-Reset', (current?.resetAt || now + RATE_LIMIT_WINDOW_MS).toString())

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // Protected route kontrolü
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
  const isAuthRoute = authRoutes.some(route => path.startsWith(route))

  // Giriş yapmamış kullanıcı protected route'a gitmeye çalışıyor
  if (isProtectedRoute && !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectTo', path)
    const redirectResponse = NextResponse.redirect(loginUrl)
    return addSecurityHeaders(redirectResponse)
  }

  // Giriş yapmış kullanıcı auth route'a gitmeye çalışıyor
  if (isAuthRoute && user) {
    const feedResponse = NextResponse.redirect(new URL('/feed', request.url))
    return addSecurityHeaders(feedResponse)
  }
  
  // Add security headers to all responses
  return addSecurityHeaders(response)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
