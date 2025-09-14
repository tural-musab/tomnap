'use client'

import React, { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'
import { AlertCircle, RefreshCw, Home, ArrowLeft } from 'lucide-react'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  useEffect(() => {
    // Log error to Sentry with additional context
    Sentry.captureException(error, {
      tags: {
        errorBoundary: 'GlobalError',
        errorType: 'globalError',
      },
      contexts: {
        error: {
          digest: error.digest,
        },
      },
    })

    // Log error to console in development
    if (isDevelopment) {
      console.error('Global error caught:', error)
    }
  }, [error, isDevelopment])

  const handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  const handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }

  const handleGoBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back()
    }
  }

  return (
    <html lang="tr">
      <body>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 text-center bg-card rounded-lg border shadow-lg">
            <div className="flex justify-center mb-4">
              <AlertCircle className="w-16 h-16 text-red-500" />
            </div>
            
            <h1 className="text-xl font-semibold mb-2 text-foreground">
              Kritik Bir Hata Oluştu
            </h1>
            
            <p className="text-muted-foreground mb-6">
              Üzgünüz, uygulama beklenmedik bir hata ile karşılaştı. 
              Bu durumu geliştirici ekibine otomatik olarak bildirdik.
            </p>
            
            {isDevelopment && error && (
              <details className="mb-6 text-left">
                <summary className="text-sm font-medium cursor-pointer text-red-600 hover:text-red-700 mb-2">
                  Geliştirici Detayları
                </summary>
                <div className="mt-2 p-3 bg-red-50 dark:bg-red-950/20 rounded border text-xs font-mono">
                  <div className="text-red-800 dark:text-red-200 font-semibold mb-1">
                    {error.name}: {error.message}
                  </div>
                  {error.digest && (
                    <div className="text-red-700 dark:text-red-300 mb-1">
                      Digest: {error.digest}
                    </div>
                  )}
                  <pre className="text-red-700 dark:text-red-300 whitespace-pre-wrap break-all">
                    {error.stack}
                  </pre>
                </div>
              </details>
            )}
            
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={reset}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Tekrar Dene
              </button>
              
              <button
                onClick={handleReload}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-input bg-background text-foreground rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Sayfayı Yenile
              </button>
              
              <button
                onClick={handleGoHome}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-input bg-background text-foreground rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Home className="w-4 h-4" />
                Ana Sayfa
              </button>
              
              <button
                onClick={handleGoBack}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-input bg-background text-foreground rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Geri
              </button>
            </div>
            
            {error.digest && (
              <div className="mt-4 text-xs text-muted-foreground">
                Hata ID: {error.digest}
              </div>
            )}
          </div>
        </div>
      </body>
    </html>
  )
}
