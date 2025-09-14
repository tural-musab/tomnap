import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Basit IP tabanlı rate limiting (global scope: aynı edge instance'ında paylaşımlı)
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 120
type Counter = { count: number; resetAt: number }
const ipCounters = new Map<string, Counter>()

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
      const res = NextResponse.json({ error: 'Too Many Requests' }, { status: 429 })
      res.headers.set('Retry-After', Math.ceil((current.resetAt - now) / 1000).toString())
      return res
    }
  }

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
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Giriş yapmış kullanıcı auth route'a gitmeye çalışıyor
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/feed', request.url))
  }
  
  return response
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
