'use client'

import React from 'react'
import { AlertCircle, RefreshCw, Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<ErrorFallbackProps>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  isolate?: boolean
}

interface ErrorFallbackProps {
  error: Error | null
  resetError: () => void
  isolate?: boolean
}

const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  resetError, 
  isolate = false 
}) => {
  const isDevelopment = process.env.NODE_ENV === 'development'
  
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

  if (isolate) {
    return (
      <div className="p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-950/20 dark:border-red-800">
        <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Component Error</span>
        </div>
        <p className="text-sm text-red-600 dark:text-red-300 mt-1">
          Bu bileşen yüklenirken bir hata oluştu.
        </p>
        <Button
          size="sm"
          variant="outline"
          onClick={resetError}
          className="mt-2 text-red-800 border-red-300 hover:bg-red-100 dark:text-red-200 dark:border-red-700 dark:hover:bg-red-900/20"
        >
          Tekrar Dene
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle className="w-16 h-16 text-red-500" />
        </div>
        
        <h1 className="text-xl font-semibold mb-2">
          Bir Hata Oluştu
        </h1>
        
        <p className="text-muted-foreground mb-6">
          Üzgünüz, beklenmedik bir hata meydana geldi. 
          Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
        </p>
        
        {isDevelopment && error && (
          <details className="mb-6 text-left">
            <summary className="text-sm font-medium cursor-pointer text-red-600 hover:text-red-700">
              Geliştirici Detayları
            </summary>
            <div className="mt-2 p-3 bg-red-50 dark:bg-red-950/20 rounded border text-xs font-mono">
              <div className="text-red-800 dark:text-red-200 font-semibold mb-1">
                {error.name}: {error.message}
              </div>
              <pre className="text-red-700 dark:text-red-300 whitespace-pre-wrap break-all">
                {error.stack}
              </pre>
            </div>
          </details>
        )}
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={resetError}
            className="flex-1 gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Tekrar Dene
          </Button>
          
          <Button
            variant="outline"
            onClick={handleReload}
            className="flex-1 gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Sayfayı Yenile
          </Button>
          
          <Button
            variant="outline"
            onClick={handleGoHome}
            className="flex-1 gap-2"
          >
            <Home className="w-4 h-4" />
            Ana Sayfa
          </Button>
          
          <Button
            variant="outline"
            onClick={handleGoBack}
            className="flex-1 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Geri
          </Button>
        </div>
      </Card>
    </div>
  )
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error)
      console.error('Error info:', errorInfo)
    }

    this.setState({
      error,
      errorInfo,
    })

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)

    // Log error to external service (e.g., Sentry)
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack,
          },
        },
      })
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      
      return (
        <FallbackComponent
          error={this.state.error}
          resetError={this.resetError}
          isolate={this.props.isolate}
        />
      )
    }

    return this.props.children
  }
}

// Hook for functional components to report errors
export function useErrorHandler() {
  return React.useCallback((error: Error, errorInfo?: { componentStack?: string }) => {
    // Log error
    console.error('Manual error report:', error)
    
    // Report to Sentry
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(error, {
        contexts: errorInfo ? {
          react: errorInfo,
        } : undefined,
      })
    }
  }, [])
}

// Higher-order component for wrapping components
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

export default ErrorBoundary