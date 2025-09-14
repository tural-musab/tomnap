'use client'

import { useEffect } from 'react'
import { onCLS, onFCP, onLCP, onTTFB, onINP, type Metric } from 'web-vitals'

/**
 * Web Vitals Reporter Component
 * Automatically measures and reports Core Web Vitals metrics to the performance API
 */
export function WebVitalsReporter(): null {
  useEffect(() => {
    const reportMetric = async (metric: Metric) => {
      try {
        // Send to performance API
        await fetch('/api/performance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: metric.name,
            value: metric.value,
            rating: metric.rating,
            delta: metric.delta,
            id: metric.id,
            navigationType: metric.navigationType,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            connectionType:
              (navigator as Navigator & { connection?: { effectiveType?: string } }).connection
                ?.effectiveType || 'unknown',
          }),
        })

        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Web Vitals] ${metric.name}:`, {
            value: metric.value,
            rating: metric.rating,
            delta: metric.delta,
          })
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[Web Vitals] Failed to report metric:', error)
        }
      }
    }

    // Register all Web Vitals metrics
    onCLS(reportMetric)
    onFCP(reportMetric)
    onLCP(reportMetric)
    onTTFB(reportMetric)
    onINP(reportMetric)

    // Report custom page visibility metrics
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Page is being hidden, good time to report final metrics
        onCLS(reportMetric, { reportAllChanges: true })
        onFCP(reportMetric, { reportAllChanges: true })
        onLCP(reportMetric, { reportAllChanges: true })
        onTTFB(reportMetric, { reportAllChanges: true })
        onINP(reportMetric, { reportAllChanges: true })
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return null // This component renders nothing
}

/**
 * Hook for programmatic Web Vitals measurement
 */
export function useWebVitals(): { measureMetrics: () => Promise<Record<string, Metric>> } {
  const measureMetrics = () => {
    return new Promise<Record<string, Metric>>((resolve) => {
      const metrics: Record<string, Metric> = {}
      let reportCount = 0
      const expectedMetrics = 6 // CLS, FCP, FID, LCP, TTFB, INP

      const collectMetric = (metric: Metric) => {
        metrics[metric.name] = metric
        reportCount++

        if (reportCount >= expectedMetrics) {
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
  }

  return { measureMetrics }
}

/**
 * Performance diagnostics component
 * Shows real-time Web Vitals in development
 */
export function WebVitalsDiagnostics(): null {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      return
    }

    let diagnosticsElement: HTMLDivElement | null = null

    const createDiagnosticsElement = () => {
      diagnosticsElement = document.createElement('div')
      diagnosticsElement.id = 'web-vitals-diagnostics'
      diagnosticsElement.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-family: monospace;
        font-size: 11px;
        z-index: 9999;
        line-height: 1.4;
        min-width: 200px;
      `
      document.body.appendChild(diagnosticsElement)
    }

    const updateDiagnostics = (metric: Metric) => {
      if (!diagnosticsElement) {
        createDiagnosticsElement()
      }

      const existingMetrics = diagnosticsElement!.innerHTML
      const color =
        metric.rating === 'good'
          ? '#00ff00'
          : metric.rating === 'needs-improvement'
            ? '#ffaa00'
            : '#ff0000'

      const metricLine = `<div style="color: ${color}">${metric.name}: ${metric.value.toFixed(2)}ms (${metric.rating})</div>`

      if (existingMetrics.includes(`${metric.name}:`)) {
        diagnosticsElement!.innerHTML = existingMetrics.replace(
          new RegExp(`<div[^>]*>${metric.name}:.*?</div>`),
          metricLine
        )
      } else {
        diagnosticsElement!.innerHTML += metricLine
      }
    }

    onCLS(updateDiagnostics)
    onFCP(updateDiagnostics)
    onLCP(updateDiagnostics)
    onTTFB(updateDiagnostics)
    onINP(updateDiagnostics)

    return () => {
      if (diagnosticsElement) {
        document.body.removeChild(diagnosticsElement)
      }
    }
  }, [])

  return null
}
