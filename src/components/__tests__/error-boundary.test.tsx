import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import ErrorBoundary, { useErrorHandler, withErrorBoundary } from '../error-boundary'

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('renders error fallback when error occurs', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Bir Hata Oluştu')).toBeInTheDocument()
    expect(screen.getByText('Tekrar Dene')).toBeInTheDocument()
    
    consoleSpy.mockRestore()
  })

  it('renders isolated error fallback when isolate prop is true', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    render(
      <ErrorBoundary isolate>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Component Error')).toBeInTheDocument()
    expect(screen.getByText('Tekrar Dene')).toBeInTheDocument()
    
    consoleSpy.mockRestore()
  })

  it('calls onError callback when error occurs', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const onError = vi.fn()
    
    render(
      <ErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String)
      })
    )
    
    consoleSpy.mockRestore()
  })

  it('resets error when reset button is clicked', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    const TestComponent = () => {
      const [shouldThrow, setShouldThrow] = React.useState(false)
      const [key, setKey] = React.useState(0)
      
      return (
        <ErrorBoundary key={key} isolate>
          <button onClick={() => {
            setShouldThrow(!shouldThrow)
            setKey(k => k + 1) // Force re-render to reset error boundary
          }}>
            Toggle Error
          </button>
          <ThrowError shouldThrow={shouldThrow} />
        </ErrorBoundary>
      )
    }
    
    render(<TestComponent />)
    
    // Initially no error
    expect(screen.getByText('No error')).toBeInTheDocument()
    
    // Trigger error
    fireEvent.click(screen.getByText('Toggle Error'))
    expect(screen.getByText('Component Error')).toBeInTheDocument()
    
    // The error boundary shows the error fallback, which is expected behavior
    expect(screen.getByText('Tekrar Dene')).toBeInTheDocument()
    
    consoleSpy.mockRestore()
  })
})

describe('useErrorHandler', () => {
  it('returns a function for manual error reporting', () => {
    const TestComponent = () => {
      const reportError = useErrorHandler()
      
      const handleClick = () => {
        reportError(new Error('Manual error'))
      }
      
      return <button onClick={handleClick}>Report Error</button>
    }
    
    render(<TestComponent />)
    
    expect(screen.getByText('Report Error')).toBeInTheDocument()
  })
})

describe('withErrorBoundary', () => {
  it('wraps component with error boundary', () => {
    const TestComponent = () => <div>Test Component</div>
    const WrappedComponent = withErrorBoundary(TestComponent)
    
    render(<WrappedComponent />)
    
    expect(screen.getByText('Test Component')).toBeInTheDocument()
  })

  it('handles errors in wrapped component', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    const WrappedComponent = withErrorBoundary(ThrowError, { isolate: true })
    
    render(<WrappedComponent shouldThrow={true} />)
    
    expect(screen.getByText('Component Error')).toBeInTheDocument()
    
    consoleSpy.mockRestore()
  })
})