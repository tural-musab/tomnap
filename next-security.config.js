/**
 * Next.js Security Configuration
 * Comprehensive security headers and policies for TomNAP application
 */

const isProd = process.env.NODE_ENV === 'production'
const isDev = process.env.NODE_ENV === 'development'

// Content Security Policy configuration
const cspDirectives = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Required for Next.js hot reload in development
    "'unsafe-eval'", // Required for webpack in development
    'https://js.sentry-io',
    'https://browser.sentry-io',
    'https://vercel.live',
    ...(isDev ? ["'unsafe-inline'", "'unsafe-eval'"] : [])
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for styled-components and CSS-in-JS
    'https://fonts.googleapis.com'
  ],
  'font-src': [
    "'self'",
    'https://fonts.gstatic.com',
    'data:'
  ],
  'img-src': [
    "'self'",
    'data:',
    'https:',
    'blob:',
    // Add your CDN domains here
    'https://*.supabase.co',
    'https://*.supabase.io',
    // Social media image domains for sharing
    'https://*.googleapis.com',
    'https://*.googleusercontent.com'
  ],
  'media-src': [
    "'self'",
    'https:',
    'blob:',
    // Add your video/audio CDN domains here
    'https://*.supabase.co',
    'https://*.supabase.io'
  ],
  'connect-src': [
    "'self'",
    'https:',
    'wss:',
    'blob:',
    // Supabase connections
    'https://*.supabase.co',
    'https://*.supabase.io',
    // Sentry
    'https://*.sentry.io',
    // Analytics and monitoring
    'https://vitals.vercel-analytics.com',
    // Development hot reload
    ...(isDev ? ['ws:', 'wss:'] : [])
  ],
  'frame-src': [
    "'self'",
    'https://js.sentry-io',
    'https://vercel.live'
  ],
  'worker-src': [
    "'self'",
    'blob:'
  ],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': []
}

// Convert CSP directives to string
const cspString = Object.entries(cspDirectives)
  .map(([key, values]) => {
    const valueString = values.length > 0 ? ` ${values.join(' ')}` : ''
    return `${key}${valueString}`
  })
  .join('; ')

const securityHeaders = [
  // Content Security Policy
  {
    key: 'Content-Security-Policy',
    value: cspString
  },
  // Prevent clickjacking
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  // Prevent MIME type sniffing
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  // Enable XSS protection
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  // Control referrer information
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  // Feature Policy / Permissions Policy
  {
    key: 'Permissions-Policy',
    value: [
      'camera=()',
      'microphone=()',
      'geolocation=(self)',
      'interest-cohort=()',
      'browsing-topics=()',
      'payment=(self)',
      'usb=()',
      'bluetooth=()',
      'accelerometer=()',
      'gyroscope=()',
      'magnetometer=()',
      'serial=()',
      'sync-xhr=()',
      'web-share=(self)'
    ].join(', ')
  }
]

// Add HSTS only in production with HTTPS
if (isProd) {
  securityHeaders.push({
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  })
}

// Additional security headers
const additionalHeaders = [
  // Cross-Origin Policies
  {
    key: 'Cross-Origin-Embedder-Policy',
    value: 'unsafe-none' // Required for certain features
  },
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin-allow-popups' // Allow popups for OAuth
  },
  {
    key: 'Cross-Origin-Resource-Policy',
    value: 'cross-origin' // Allow cross-origin requests
  },
  // DNS prefetch control
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  // Download options for IE
  {
    key: 'X-Download-Options',
    value: 'noopen'
  },
  // Cross-domain policies
  {
    key: 'X-Permitted-Cross-Domain-Policies',
    value: 'none'
  }
]

module.exports = {
  securityHeaders: [...securityHeaders, ...additionalHeaders],
  csp: {
    directives: cspDirectives,
    string: cspString
  },
  
  // Rate limiting configuration
  rateLimit: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 120, // requests per window
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    standardHeaders: true,
    legacyHeaders: false
  },
  
  // Trusted domains configuration
  trustedDomains: {
    api: [
      'https://api.tomnap.com',
      'https://tomnap.com'
    ],
    cdn: [
      'https://*.supabase.co',
      'https://*.supabase.io',
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ],
    analytics: [
      'https://vitals.vercel-analytics.com',
      'https://js.sentry-io',
      'https://browser.sentry-io'
    ]
  }
}