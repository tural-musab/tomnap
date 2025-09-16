'use client'

import React from 'react'
import ErrorBoundary from './error-boundary'

interface AsyncErrorBoundaryState {
  asyncError: Error | null
}

interface AsyncErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error | null; resetError: () => void }>
  onError?: (error: Error) => void
  isolate?: boolean
}

/**
 * ErrorBoundary that also catches async errors and promise rejections
 */
class AsyncErrorBoundary extends React.Component<AsyncErrorBoundaryProps, AsyncErrorBoundaryState> {
  constructor(props: AsyncErrorBoundaryProps) {
    super(props)
    this.state = {
      asyncError: null,
    }
  }

  componentDidMount() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection)
  }

  componentWillUnmount() {
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection)
  }

  handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    // Only handle errors that originate from our app
    const error = event.reason
    if (error instanceof Error) {
      this.setState({ asyncError: error })
      this.props.onError?.(error)
      
      // Log to Sentry
      if (typeof window !== 'undefined' && (window as any).Sentry) {
        (window as any).Sentry.captureException(error, {
          tags: {
            errorBoundary: 'AsyncErrorBoundary',
            errorType: 'unhandledRejection',
          },
        })
      }
      
      // Prevent the default browser error reporting
      event.preventDefault()
    }
  }

  resetError = () => {
    this.setState({ asyncError: null })
  }

  render() {
    if (this.state.asyncError) {
      const FallbackComponent = this.props.fallback
      
      if (FallbackComponent) {
        return (
          <FallbackComponent
            error={this.state.asyncError}
            resetError={this.resetError}
          />
        )
      }
      
      // Fall back to the regular error boundary behavior
      throw this.state.asyncError
    }

    return (
      <ErrorBoundary 
        onError={this.props.onError}
        isolate={this.props.isolate}
      >
        {this.props.children}
      </ErrorBoundary>
    )
  }
}

// Hook for manually reporting async errors
export function useAsyncError() {
  const [, setAsyncError] = React.useState<Error | null>(null)
  
  return React.useCallback((error: Error) => {
    setAsyncError(() => {
      throw error
    })
  }, [])
}

// Utility to wrap async functions with error boundary
export function withAsyncErrorHandler<T extends (...args: any[]) => Promise<any>>(
  asyncFn: T,
  onError?: (error: Error) => void
): T {
  return ((...args: Parameters<T>) => {
    return asyncFn(...args).catch((error: Error) => {
      onError?.(error)
      
      // Log to Sentry
      if (typeof window !== 'undefined' && (window as any).Sentry) {
        (window as any).Sentry.captureException(error, {
          tags: {
            errorBoundary: 'AsyncErrorHandler',
            errorType: 'asyncFunction',
          },
        })
      }
      
      throw error
    })
  }) as T
}

export default AsyncErrorBoundary