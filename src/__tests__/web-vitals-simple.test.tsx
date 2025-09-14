import React from 'react'
import { render } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { WebVitalsReporter, WebVitalsDiagnostics } from '@/components/web-vitals-reporter'
import { renderHook } from '@testing-library/react'
import { usePerformanceTracking } from '@/hooks/use-performance-tracking'

// Mock web-vitals
vi.mock('web-vitals', () => ({
  getCLS: vi.fn(() => {}),
  getFCP: vi.fn(() => {}),
  getFID: vi.fn(() => {}),
  getLCP: vi.fn(() => {}),
  getTTFB: vi.fn(() => {}),
  getINP: vi.fn(() => {}),
}))

// Mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
) as unknown as typeof fetch

// Mock window.location
Object.defineProperty(window, 'location', {
  value: { href: 'https://tomnap.com/test' },
  writable: true,
})

// Mock navigator
Object.defineProperty(global, 'navigator', {
  value: {
    userAgent: 'Mozilla/5.0 (Test Browser)',
    connection: { effectiveType: '4g' },
  },
  writable: true,
})

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
})

describe('Web Vitals Integration - Simple Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('WebVitalsReporter Component', () => {
    it('should render without crashing', () => {
      render(<WebVitalsReporter />)
      expect(true).toBe(true)
    })

    it('should be a function component', () => {
      expect(typeof WebVitalsReporter).toBe('function')
    })
  })

  describe('WebVitalsDiagnostics Component', () => {
    it('should render without crashing', () => {
      render(<WebVitalsDiagnostics />)
      expect(true).toBe(true)
    })

    it('should be a function component', () => {
      expect(typeof WebVitalsDiagnostics).toBe('function')
    })
  })

  describe('usePerformanceTracking Hook', () => {
    it('should return tracking functions', () => {
      const { result } = renderHook(() => usePerformanceTracking())

      expect(result.current).toHaveProperty('reportCustomMetric')
      expect(typeof result.current.reportCustomMetric).toBe('function')
    })

    it('should accept configuration options', () => {
      const { result } = renderHook(() => usePerformanceTracking({
        enableConsoleLogging: false,
        enableApiReporting: true,
        debounceMs: 1000,
        endpoint: '/custom/performance',
      }))

      expect(result.current).toHaveProperty('reportCustomMetric')
    })

    it('should work with default configuration', () => {
      const { result } = renderHook(() => usePerformanceTracking({}))

      expect(result.current).toHaveProperty('reportCustomMetric')
    })
  })

  describe('Component Integration', () => {
    it('should integrate Web Vitals components in app layout', () => {
      const TestApp = () => (
        <div>
          <h1>Test App</h1>
          <WebVitalsReporter />
          <WebVitalsDiagnostics />
        </div>
      )

      const { container } = render(<TestApp />)
      expect(container.querySelector('h1')).toHaveTextContent('Test App')
    })
  })

  describe('Performance Configuration', () => {
    it('should handle different config combinations', () => {
      const configs = [
        { enableConsoleLogging: true },
        { enableApiReporting: false },
        { debounceMs: 500 },
        { endpoint: '/api/metrics' },
        {},
      ]

      configs.forEach(config => {
        const { result } = renderHook(() => usePerformanceTracking(config))
        expect(result.current.reportCustomMetric).toBeTruthy()
      })
    })
  })

  describe('Environment Detection', () => {
    it('should work in test environment', () => {
      expect(process.env.NODE_ENV).toBe('test')
      
      const { result } = renderHook(() => usePerformanceTracking({
        enableConsoleLogging: process.env.NODE_ENV === 'development',
      }))

      expect(result.current.reportCustomMetric).toBeTruthy()
    })
  })
})