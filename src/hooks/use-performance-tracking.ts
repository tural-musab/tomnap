'use client'

import React, { useEffect, useCallback, useRef, useMemo } from 'react'
import { getCLS, getFCP, getFID, getLCP, getTTFB, getINP, type Metric } from 'web-vitals'

/**
 * Performance tracking configuration
 */
interface PerformanceConfig {
  enableConsoleLogging?: boolean
  enableApiReporting?: boolean
  debounceMs?: number
  endpoint?: string
}

const DEFAULT_CONFIG: PerformanceConfig = {
  enableConsoleLogging: process.env.NODE_ENV === 'development',
  enableApiReporting: true,
  debounceMs: 1000,
  endpoint: '/api/performance',
}

/**
 * Comprehensive performance tracking hook
 */
export function usePerformanceTracking(config: PerformanceConfig = {}): { reportCustomMetric: (name: string, value: number, rating?: 'good' | 'needs-improvement' | 'poor') => void } {
  const fullConfig = useMemo(() => ({ ...DEFAULT_CONFIG, ...config }), [config])
  const reportedMetrics = useRef<Set<string>>(new Set())
  const reportTimeout = useRef<NodeJS.Timeout | null>(null)
  const pendingReports = useRef<Metric[]>([])

  const reportMetric = useCallback(async (metric: Metric) => {
    // Avoid duplicate reports
    const metricKey = `${metric.name}-${metric.id}`
    if (reportedMetrics.current.has(metricKey)) {
      return
    }
    reportedMetrics.current.add(metricKey)

    // Console logging
    if (fullConfig.enableConsoleLogging) {
      const color = metric.rating === 'good' ? '🟢' : 
                   metric.rating === 'needs-improvement' ? '🟡' : '🔴'
      console.log(`${color} [Web Vitals] ${metric.name}:`, {
        value: `${metric.value.toFixed(2)}ms`,
        rating: metric.rating,
        delta: metric.delta ? `${metric.delta.toFixed(2)}ms` : 'N/A',
        id: metric.id,
      })
    }

    // API reporting with debouncing
    if (fullConfig.enableApiReporting) {
      pendingReports.current.push(metric)

      // Clear existing timeout
      if (reportTimeout.current) {
        clearTimeout(reportTimeout.current)
      }

      // Set new timeout for batch reporting
      reportTimeout.current = setTimeout(async () => {
        const reportsToSend = [...pendingReports.current]
        pendingReports.current = []

        try {
          await fetch(fullConfig.endpoint!, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              metrics: reportsToSend.map(m => ({
                name: m.name,
                value: m.value,
                rating: m.rating,
                delta: m.delta,
                id: m.id,
                navigationType: m.navigationType,
                timestamp: Date.now(),
                url: window.location.href,
                userAgent: navigator.userAgent,
                connectionType: (navigator as Navigator & { connection?: { effectiveType?: string } }).connection?.effectiveType || 'unknown',
                viewport: {
                  width: window.innerWidth,
                  height: window.innerHeight,
                },
              })),
              sessionId: getSessionId(),
              pageLoadId: getPageLoadId(),
            }),
          })
        } catch (error) {
          if (fullConfig.enableConsoleLogging) {
            console.error('[Web Vitals] Failed to report metrics:', error)
          }
        }
      }, fullConfig.debounceMs)
    }
  }, [fullConfig])

  useEffect(() => {
    // Register all Web Vitals metrics
    getCLS(reportMetric)
    getFCP(reportMetric)
    getFID(reportMetric)
    getLCP(reportMetric)
    getTTFB(reportMetric)
    getINP(reportMetric)

    return () => {
      if (reportTimeout.current) {
        clearTimeout(reportTimeout.current)
      }
    }
  }, [reportMetric])

  return {
    reportCustomMetric: useCallback((name: string, value: number, rating?: 'good' | 'needs-improvement' | 'poor') => {
      const customMetric: Metric = {
        name: `custom-${name}`,
        value,
        rating: rating || (value < 100 ? 'good' : value < 300 ? 'needs-improvement' : 'poor'),
        delta: 0,
        id: Math.random().toString(36).substr(2, 9),
        entries: [],
        navigationType: 'navigate',
      }
      reportMetric(customMetric)
    }, [reportMetric]),
  }
}

/**
 * Page performance tracking hook for specific pages
 */
export function usePagePerformanceTracking(pageName: string): {
  trackInteraction: (interactionName: string) => void
  trackResourceLoad: (resourceName: string, loadTime: number) => void
  markMilestone: (milestoneName: string) => void
} {
  const startTime = useRef<number>(Date.now())
  const { reportCustomMetric } = usePerformanceTracking()

  const trackInteraction = useCallback((interactionName: string) => {
    const interactionTime = Date.now() - startTime.current
    reportCustomMetric(`${pageName}-${interactionName}`, interactionTime)
  }, [pageName, reportCustomMetric])

  const trackResourceLoad = useCallback((resourceName: string, loadTime: number) => {
    reportCustomMetric(`${pageName}-resource-${resourceName}`, loadTime)
  }, [pageName, reportCustomMetric])

  useEffect(() => {
    // Track page visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        startTime.current = Date.now()
      } else if (document.visibilityState === 'hidden') {
        const sessionDuration = Date.now() - startTime.current
        reportCustomMetric(`${pageName}-session-duration`, sessionDuration)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      
      // Report final session duration
      const finalDuration = Date.now() - startTime.current
      reportCustomMetric(`${pageName}-session-duration`, finalDuration)
    }
  }, [pageName, reportCustomMetric])

  return {
    trackInteraction,
    trackResourceLoad,
    markMilestone: useCallback((milestoneName: string) => {
      const milestoneTime = Date.now() - startTime.current
      reportCustomMetric(`${pageName}-milestone-${milestoneName}`, milestoneTime)
    }, [pageName, reportCustomMetric]),
  }
}

/**
 * Component performance tracking HOC
 */
export function withPerformanceTracking<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  componentName: string
): React.ComponentType<T> {
  const PerformanceTrackedComponent = (props: T) => {
    const renderStart = useRef<number>(Date.now())
    const { reportCustomMetric } = usePerformanceTracking()

    useEffect(() => {
      // Report render time
      const renderTime = Date.now() - renderStart.current
      reportCustomMetric(`component-${componentName}-render`, renderTime)
    }, [reportCustomMetric])

    return React.createElement(WrappedComponent, props)
  }

  PerformanceTrackedComponent.displayName = `withPerformanceTracking(${componentName})`
  return PerformanceTrackedComponent
}

/**
 * Utility functions
 */
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('performance-session-id')
  if (!sessionId) {
    sessionId = Math.random().toString(36).substr(2, 9)
    sessionStorage.setItem('performance-session-id', sessionId)
  }
  return sessionId
}

function getPageLoadId(): string {
  let pageLoadId = sessionStorage.getItem('performance-page-load-id')
  if (!pageLoadId) {
    pageLoadId = Math.random().toString(36).substr(2, 9)
    sessionStorage.setItem('performance-page-load-id', pageLoadId)
  }
  return pageLoadId
}

/**
 * Performance metrics dashboard hook
 */
export function usePerformanceDashboard(): {
  collectAllMetrics: () => Promise<Record<string, Metric>>
  getPerformanceScore: () => number
  getCurrentMetrics: () => Record<string, Metric>
} {
  const metricsRef = useRef<Record<string, Metric>>({})

  const collectAllMetrics = useCallback(() => {
    return new Promise<Record<string, Metric>>((resolve) => {
      const metrics: Record<string, Metric> = {}
      let collectedCount = 0
      const expectedMetrics = 6

      const collectMetric = (metric: Metric) => {
        metrics[metric.name] = metric
        metricsRef.current[metric.name] = metric
        collectedCount++

        if (collectedCount >= expectedMetrics) {
          resolve(metrics)
        }
      }

      getCLS(collectMetric)
      getFCP(collectMetric)
      getFID(collectMetric)
      getLCP(collectMetric)
      getTTFB(collectMetric)
      getINP(collectMetric)

      // Timeout after 5 seconds
      setTimeout(() => resolve(metrics), 5000)
    })
  }, [])

  const getPerformanceScore = useCallback(() => {
    const metrics = metricsRef.current
    const scores = Object.values(metrics).map(metric => {
      switch (metric.rating) {
        case 'good': return 100
        case 'needs-improvement': return 75
        case 'poor': return 50
        default: return 0
      }
    })

    return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
  }, [])

  return {
    collectAllMetrics,
    getPerformanceScore,
    getCurrentMetrics: () => metricsRef.current,
  }
}