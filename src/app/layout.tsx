import type { Metadata, Viewport } from 'next'
import type { ReactElement } from 'react'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import RegisterSW from '@/components/register-sw'
import './globals.css'
import SonnerToaster from '@/components/ui/sonner-toaster'
import { AuthProvider } from '@/providers/auth-provider'
import { QueryProvider } from '@/providers/query-provider'
import { PerformanceProvider } from '@/providers/performance-provider'
import AsyncErrorBoundary from '@/components/async-error-boundary'
import { WebVitalsReporter, WebVitalsDiagnostics } from '@/components/web-vitals-reporter'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'TomNAP - Sosyal E-Ticaret Platformu',
    template: '%s | TomNAP'
  },
  description: 'Video ile alışverişin buluştuğu sosyal platform. TikTok tarzı video akışında ürünleri keşfedin, anında satın alın.',
  keywords: [
    'e-ticaret',
    'sosyal ticaret',
    'video alışveriş',
    'canlı yayın',
    'TomNAP',
    'online alışveriş',
    'influencer marketing',
    'sosyal medya alışveriş',
    'video commerce',
    'live shopping'
  ],
  authors: [{ name: 'TomNAP Team', url: 'https://tomnap.com/about' }],
  creator: 'TomNAP',
  publisher: 'TomNAP',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://tomnap.com'),
  alternates: {
    canonical: '/',
    languages: {
      'tr-TR': '/tr',
      'en-US': '/en',
    },
    types: {
      'application/rss+xml': [{
        url: '/feed.xml',
        title: 'TomNAP RSS Feed'
      }]
    }
  },
  openGraph: {
    title: 'TomNAP - Sosyal E-Ticaret Platformu',
    description: 'Video ile alışverişin buluştuğu sosyal platform',
    url: 'https://tomnap.com',
    siteName: 'TomNAP',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TomNAP - Sosyal E-Ticaret',
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TomNAP - Sosyal E-Ticaret Platformu',
    description: 'Video ile alışverişin buluştuğu sosyal platform',
    creator: '@tomnap',
    site: '@tomnap',
    images: [{
      url: '/twitter-image.png',
      width: 1200,
      height: 630,
      alt: 'TomNAP - Video ile Sosyal Alışveriş'
    }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png' },
      { url: '/apple-icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
      },
    ],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'TomNAP',
  },
  verification: {
    google: 'google-verification-code',
    yandex: 'yandex-verification-code',
  },
  category: 'shopping',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#9333ea' },
    { media: '(prefers-color-scheme: dark)', color: '#581c87' },
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>): Promise<ReactElement> {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="TomNAP" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TomNAP" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#9333ea" />
        
        {/* Microsoft Tiles */}
        <meta name="msapplication-TileColor" content="#9333ea" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Links */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#9333ea" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}>
        <AsyncErrorBoundary
          onError={(error) => {
            // Log to console in development
            if (process.env.NODE_ENV === 'development') {
              console.error('Root level error:', error)
            }
          }}
        >
          <PerformanceProvider>
            <AuthProvider>
              <QueryProvider>
                {children}
                <SonnerToaster />
                <WebVitalsReporter />
                <WebVitalsDiagnostics />
              </QueryProvider>
            </AuthProvider>
          </PerformanceProvider>
        </AsyncErrorBoundary>
        
        {/* PWA Service Worker Registration */}
        <RegisterSW />
        
        {/* Structured Data - Organization */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'TomNAP',
              url: 'https://tomnap.com',
              logo: 'https://tomnap.com/logo.png',
              sameAs: [
                'https://twitter.com/tomnap',
                'https://instagram.com/tomnap',
                'https://facebook.com/tomnap'
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+90-555-000-0000',
                contactType: 'Customer Support',
                email: 'support@tomnap.com',
                availableLanguage: ['Turkish', 'English']
              },
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'TR',
                addressLocality: 'Istanbul'
              }
            }),
          }}
        />
        
        {/* Structured Data - WebApplication */}
        <Script
          id="webapp-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'TomNAP',
              description: 'Video ile alışverişin buluştuğu sosyal e-ticaret platformu. TikTok tarzı video akışında ürünleri keşfedin, anında satın alın.',
              url: 'https://tomnap.com',
              applicationCategory: 'ShoppingApplication',
              operatingSystem: 'Any',
              browserRequirements: 'Requires JavaScript. Chrome 70+, Firefox 65+, Safari 12+',
              softwareVersion: '1.0.0',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'TRY',
                availability: 'https://schema.org/InStock'
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '12543',
                bestRating: '5',
                worstRating: '1'
              },
              author: {
                '@type': 'Organization',
                name: 'TomNAP Team'
              },
              creator: {
                '@type': 'Organization',
                name: 'TomNAP'
              },
              featureList: [
                'Video tabanlı ürün keşfi',
                'Anında satın alma',
                'Sosyal alışveriş deneyimi',
                'Güvenli ödeme sistemi',
                'Mobil optimize'
              ]
            }),
          }}
        />
        
        {/* Structured Data - WebSite with Search Action */}
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'TomNAP',
              description: 'Sosyal E-Ticaret Platformu',
              url: 'https://tomnap.com',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://tomnap.com/search?q={search_term_string}'
                },
                'query-input': 'required name=search_term_string'
              },
              inLanguage: 'tr-TR',
              isAccessibleForFree: true,
              hasPart: [
                {
                  '@type': 'WebPage',
                  name: 'Video Feed',
                  url: 'https://tomnap.com/feed',
                  description: 'Ürünleri video formatında keşfedin'
                },
                {
                  '@type': 'WebPage',
                  name: 'Keşfet',
                  url: 'https://tomnap.com/explore',
                  description: 'Popüler ürünleri ve yaratıcıları keşfedin'
                }
              ]
            }),
          }}
        />
      </body>
    </html>
  )
}
