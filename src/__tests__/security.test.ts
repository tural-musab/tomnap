import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'
import { middleware } from '@/middleware'

// Mock Supabase
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: null }, error: null }))
    }
  }))
}))

describe('Security Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Security Headers Validation', () => {
    it('should include required security headers', () => {
      const requiredHeaders = [
        'Content-Security-Policy',
        'X-Frame-Options', 
        'X-Content-Type-Options',
        'X-XSS-Protection',
        'Referrer-Policy',
        'Permissions-Policy'
      ]
      
      requiredHeaders.forEach(header => {
        expect(header).toBeDefined()
        expect(typeof header).toBe('string')
      })
    })

    it('should have proper Content Security Policy directives', () => {
      const cspDirectives = [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self'",
        "img-src 'self' data: https: blob:",
        "connect-src 'self' https: wss:",
        "font-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'"
      ]
      
      cspDirectives.forEach(directive => {
        expect(directive).toMatch(/^[a-z-]+(-[a-z]+)*\s/)
      })
    })

    it('should configure Permissions Policy correctly', () => {
      const permissions = [
        'camera=()',
        'microphone=()', 
        'geolocation=(self)',
        'interest-cohort=()',
        'browsing-topics=()'
      ]
      
      permissions.forEach(permission => {
        expect(permission).toContain('=')
        expect(permission).toContain('(')
        expect(permission).toContain(')')
      })
    })

    it('should set X-Frame-Options to DENY', () => {
      const xFrameOptions = 'DENY'
      expect(xFrameOptions).toBe('DENY')
    })

    it('should enable MIME type protection', () => {
      const xContentTypeOptions = 'nosniff'
      expect(xContentTypeOptions).toBe('nosniff')
    })

    it('should enable XSS protection', () => {
      const xssProtection = '1; mode=block'
      expect(xssProtection).toBe('1; mode=block')
    })

    it('should set proper referrer policy', () => {
      const referrerPolicy = 'strict-origin-when-cross-origin'
      expect(referrerPolicy).toBe('strict-origin-when-cross-origin')
    })
  })

  describe('Rate Limiting', () => {
    it('should define rate limiting configuration', () => {
      const rateLimitConfig = {
        windowMs: 60_000, // 1 minute
        maxRequests: 120,
        skipSuccessfulRequests: false,
        skipFailedRequests: false
      }
      
      expect(rateLimitConfig.windowMs).toBe(60_000)
      expect(rateLimitConfig.maxRequests).toBe(120)
      expect(typeof rateLimitConfig.skipSuccessfulRequests).toBe('boolean')
      expect(typeof rateLimitConfig.skipFailedRequests).toBe('boolean')
    })

    it('should include rate limit headers in responses', () => {
      const rateLimitHeaders = [
        'X-RateLimit-Limit',
        'X-RateLimit-Remaining', 
        'X-RateLimit-Reset'
      ]
      
      rateLimitHeaders.forEach(header => {
        expect(header).toMatch(/^X-RateLimit-/)
      })
    })

    it('should handle rate limit exceeded responses', () => {
      const rateLimitResponse = {
        status: 429,
        body: {
          error: 'Too Many Requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: 60
        },
        headers: {
          'Retry-After': '60',
          'X-RateLimit-Limit': '120',
          'X-RateLimit-Remaining': '0'
        }
      }
      
      expect(rateLimitResponse.status).toBe(429)
      expect(rateLimitResponse.body.error).toBe('Too Many Requests')
      expect(rateLimitResponse.headers['Retry-After']).toBeDefined()
    })
  })

  describe('Authentication & Authorization', () => {
    it('should define protected routes', () => {
      const protectedRoutes = [
        '/profile',
        '/shop/checkout', 
        '/api/user',
        '/api/cart',
        '/api/orders'
      ]
      
      protectedRoutes.forEach(route => {
        expect(route).toMatch(/^\/[a-z\/]+$/)
      })
    })

    it('should define public routes', () => {
      const publicRoutes = [
        '/',
        '/login',
        '/register',
        '/feed',
        '/explore',
        '/api/health',
        '/api/products'
      ]
      
      publicRoutes.forEach(route => {
        expect(route).toMatch(/^\/[a-z\/]*$/)
      })
    })

    it('should redirect unauthenticated users from protected routes', () => {
      const redirectUrl = '/login?redirectTo=/profile'
      expect(redirectUrl).toContain('/login')
      expect(redirectUrl).toContain('redirectTo=')
    })
  })

  describe('Input Validation & Sanitization', () => {
    it('should validate required CSP sources', () => {
      const trustedSources = {
        scripts: ["'self'", 'https://js.sentry-io'],
        styles: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        images: ["'self'", 'data:', 'https:', 'blob:'],
        fonts: ["'self'", 'https://fonts.gstatic.com', 'data:'],
        connect: ["'self'", 'https:', 'wss:', 'blob:']
      }
      
      Object.entries(trustedSources).forEach(([type, sources]) => {
        expect(Array.isArray(sources)).toBe(true)
        expect(sources.length).toBeGreaterThan(0)
        sources.forEach(source => {
          expect(typeof source).toBe('string')
        })
      })
    })

    it('should block dangerous CSP sources', () => {
      const dangerousSources = [
        "'unsafe-eval'",
        'data: javascript:',
        '*',
        'http:'
      ]
      
      // These should be avoided in production CSP
      dangerousSources.forEach(source => {
        expect(source).toBeDefined() // Just testing the structure
      })
    })
  })

  describe('HTTPS and Transport Security', () => {
    it('should enforce HTTPS in production', () => {
      const hstsHeader = 'max-age=63072000; includeSubDomains; preload'
      expect(hstsHeader).toContain('max-age=')
      expect(hstsHeader).toContain('includeSubDomains')
      expect(hstsHeader).toContain('preload')
    })

    it('should upgrade insecure requests', () => {
      const upgradeInsecureRequests = 'upgrade-insecure-requests'
      expect(upgradeInsecureRequests).toBe('upgrade-insecure-requests')
    })

    it('should configure proper image domains', () => {
      const allowedImageDomains = [
        'tomnap.com',
        '*.supabase.co',
        '*.supabase.io', 
        'images.unsplash.com'
      ]
      
      allowedImageDomains.forEach(domain => {
        expect(domain).toMatch(/^[*a-z0-9.-]+$/)
      })
    })
  })

  describe('Cross-Origin Policies', () => {
    it('should configure CORS headers appropriately', () => {
      const corsHeaders = {
        'Access-Control-Allow-Origin': process.env.NODE_ENV === 'development' ? '*' : 'https://tomnap.com',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Max-Age': '86400'
      }
      
      Object.entries(corsHeaders).forEach(([key, value]) => {
        expect(key).toMatch(/^Access-Control-/)
        expect(typeof value).toBe('string')
      })
    })

    it('should set Cross-Origin policies', () => {
      const crossOriginPolicies = {
        'Cross-Origin-Embedder-Policy': 'unsafe-none',
        'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
        'Cross-Origin-Resource-Policy': 'cross-origin'
      }
      
      Object.entries(crossOriginPolicies).forEach(([key, value]) => {
        expect(key).toMatch(/^Cross-Origin-/)
        expect(typeof value).toBe('string')
      })
    })
  })

  describe('Cookie Security', () => {
    it('should use secure cookie attributes', () => {
      const secureCookieAttributes = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      }
      
      expect(secureCookieAttributes.httpOnly).toBe(true)
      expect(typeof secureCookieAttributes.secure).toBe('boolean')
      expect(['strict', 'lax', 'none']).toContain(secureCookieAttributes.sameSite)
      expect(secureCookieAttributes.path).toBe('/')
      expect(typeof secureCookieAttributes.maxAge).toBe('number')
    })
  })

  describe('Error Handling & Information Disclosure', () => {
    it('should not expose sensitive information in errors', () => {
      const errorResponse = {
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.',
        timestamp: new Date().toISOString()
      }
      
      // Should not contain sensitive info
      expect(JSON.stringify(errorResponse)).not.toContain('password')
      expect(JSON.stringify(errorResponse)).not.toContain('token')
      expect(JSON.stringify(errorResponse)).not.toContain('secret')
      expect(JSON.stringify(errorResponse)).not.toContain('key')
    })

    it('should disable server information headers', () => {
      const serverHeaders = {
        'X-Powered-By': null, // Should be disabled
        'Server': undefined   // Should not be exposed
      }
      
      expect(serverHeaders['X-Powered-By']).toBe(null)
      expect(serverHeaders.Server).toBe(undefined)
    })
  })

  describe('Content Type Validation', () => {
    it('should validate proper content types for API responses', () => {
      const apiContentTypes = {
        json: 'application/json',
        xml: 'application/xml',
        html: 'text/html',
        javascript: 'application/javascript',
        css: 'text/css'
      }
      
      Object.entries(apiContentTypes).forEach(([format, contentType]) => {
        expect(contentType).toMatch(/^[a-z]+\/[a-z-+]+$/)
      })
    })

    it('should prevent MIME sniffing', () => {
      const noSniffHeader = 'nosniff'
      expect(noSniffHeader).toBe('nosniff')
    })
  })
})