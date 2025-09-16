/**
 * Performance Monitoring Library
 *
 * Comprehensive performance tracking, metrics collection, and optimization
 * for the TomNAP application with Web Vitals and custom metrics.
 */

import React from 'react'

export interface PerformanceMetric {
  name: string
  value: number
  unit: string
  timestamp: number
  url?: string
  userId?: string
  sessionId: string
  device?: {
    type: 'desktop' | 'tablet' | 'mobile'
    os?: string
    browser?: string
  }
  connection?: {
    effectiveType: string
    downlink: number
    rtt: number
  }
}

export interface WebVitalsMetric {
  name: 'CLS' | 'FCP' | 'FID' | 'INP' | 'LCP' | 'TTFB'
  value: number
  delta: number
  id: string
  navigationType: string
  rating: 'good' | 'needs-improvement' | 'poor'
}

export interface CustomMetric {
  name: string
  value: number
  labels?: Record<string, string>
  timestamp?: number
}

export interface PerformanceConfig {
  enableWebVitals: boolean
  enableCustomMetrics: boolean
  enableResourceTiming: boolean
  enableNavigationTiming: boolean
  enableUserTiming: boolean
  sampleRate: number
  endpoint?: string
  bufferSize: number
  flushInterval: number
  enableConsoleLog: boolean
}

class PerformanceMonitor {
  private config: PerformanceConfig
  private metrics: PerformanceMetric[] = []
  private sessionId: string
  private flushTimer?: NodeJS.Timeout
  private observer?: PerformanceObserver
  private isInitialized = false

  constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = {
      enableWebVitals: true,
      enableCustomMetrics: true,
      enableResourceTiming: true,
      enableNavigationTiming: true,
      enableUserTiming: true,
      sampleRate: 1.0,
      bufferSize: 100,
      flushInterval: 30000, // 30 seconds
      enableConsoleLog: process.env.NODE_ENV === 'development',
      ...config,
    }

    this.sessionId = this.generateSessionId()

    if (typeof window !== 'undefined') {
      this.initialize()
    }
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private initialize(): void {
    if (this.isInitialized || typeof window === 'undefined') return

    // Initialize Web Vitals monitoring
    if (this.config.enableWebVitals) {
      this.initWebVitals()
    }

    // Initialize Performance Observer for resource timing
    if (this.config.enableResourceTiming || this.config.enableNavigationTiming) {
      this.initPerformanceObserver()
    }

    // Start periodic flushing
    this.startPeriodicFlush()

    // Monitor page visibility changes
    document.addEventListener('visibilitychange', this.handleVisibilityChange)

    // Monitor page unload
    window.addEventListener('beforeunload', this.flush)

    this.isInitialized = true
  }

  private async initWebVitals(): Promise<void> {
    try {
      const { onCLS, onFCP, onINP, onLCP, onTTFB } = await import('web-vitals')

      const vitalsCallback = (metric: WebVitalsMetric) => {
        this.recordWebVital(metric)
      }

      onCLS(vitalsCallback)
      onFCP(vitalsCallback)
      onINP(vitalsCallback)
      onLCP(vitalsCallback)
      onTTFB(vitalsCallback)
    } catch (error) {
      console.warn('Failed to initialize Web Vitals:', error)
    }
  }

  private initPerformanceObserver(): void {
    try {
      // Resource timing observer
      if (this.config.enableResourceTiming) {
        const resourceObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'resource') {
              this.recordResourceTiming(entry as PerformanceResourceTiming)
            }
          })
        })
        resourceObserver.observe({ entryTypes: ['resource'] })
      }

      // Navigation timing observer
      if (this.config.enableNavigationTiming) {
        const navigationObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'navigation') {
              this.recordNavigationTiming(entry as PerformanceNavigationTiming)
            }
          })
        })
        navigationObserver.observe({ entryTypes: ['navigation'] })
      }

      // User timing observer
      if (this.config.enableUserTiming) {
        const userObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            this.recordUserTiming(entry)
          })
        })
        userObserver.observe({ entryTypes: ['measure', 'mark'] })
      }
    } catch (error) {
      console.warn('Failed to initialize Performance Observer:', error)
    }
  }

  private recordWebVital(metric: WebVitalsMetric): void {
    const performanceMetric: PerformanceMetric = {
      name: `web_vitals_${metric.name.toLowerCase()}`,
      value: metric.value,
      unit: metric.name === 'CLS' ? 'score' : 'ms',
      timestamp: Date.now(),
      url: window.location.href,
      sessionId: this.sessionId,
      device: this.getDeviceInfo(),
      connection: this.getConnectionInfo(),
    }

    this.addMetric(performanceMetric)

    if (this.config.enableConsoleLog) {
      console.log(`[Performance] ${metric.name}: ${metric.value} (${metric.rating})`)
    }
  }

  private recordResourceTiming(entry: PerformanceResourceTiming): void {
    // Only track significant resources
    if (entry.duration < 10) return

    const resourceType = this.getResourceType(entry.name)
    const metric: PerformanceMetric = {
      name: `resource_${resourceType}_duration`,
      value: entry.duration,
      unit: 'ms',
      timestamp: Date.now(),
      url: entry.name,
      sessionId: this.sessionId,
    }

    this.addMetric(metric)

    // Track resource size if available
    if (entry.transferSize > 0) {
      const sizeMetric: PerformanceMetric = {
        name: `resource_${resourceType}_size`,
        value: entry.transferSize,
        unit: 'bytes',
        timestamp: Date.now(),
        url: entry.name,
        sessionId: this.sessionId,
      }
      this.addMetric(sizeMetric)
    }
  }

  private recordNavigationTiming(entry: PerformanceNavigationTiming): void {
    const navigationMetrics: Array<{ name: string; value: number }> = [
      { name: 'navigation_dns_lookup', value: entry.domainLookupEnd - entry.domainLookupStart },
      { name: 'navigation_tcp_connect', value: entry.connectEnd - entry.connectStart },
      { name: 'navigation_request', value: entry.responseStart - entry.requestStart },
      { name: 'navigation_response', value: entry.responseEnd - entry.responseStart },
      {
        name: 'navigation_dom_content_loaded',
        value: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
      },
      { name: 'navigation_load_complete', value: entry.loadEventEnd - entry.loadEventStart },
      { name: 'navigation_total', value: entry.loadEventEnd - entry.startTime },
    ]

    navigationMetrics.forEach(({ name, value }) => {
      if (value > 0) {
        this.addMetric({
          name,
          value,
          unit: 'ms',
          timestamp: Date.now(),
          url: window.location.href,
          sessionId: this.sessionId,
        })
      }
    })
  }

  private recordUserTiming(entry: PerformanceEntry): void {
    const metric: PerformanceMetric = {
      name: `user_timing_${entry.name}`,
      value: entry.entryType === 'measure' ? entry.duration : entry.startTime,
      unit: entry.entryType === 'measure' ? 'ms' : 'timestamp',
      timestamp: Date.now(),
      url: window.location.href,
      sessionId: this.sessionId,
    }

    this.addMetric(metric)
  }

  private getResourceType(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase()

    if (['js', 'mjs'].includes(extension || '')) return 'script'
    if (['css'].includes(extension || '')) return 'style'
    if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(extension || '')) return 'image'
    if (['woff', 'woff2', 'ttf', 'otf'].includes(extension || '')) return 'font'
    if (['mp4', 'webm', 'ogg'].includes(extension || '')) return 'video'
    if (['mp3', 'wav', 'ogg'].includes(extension || '')) return 'audio'
    if (url.includes('/api/')) return 'api'

    return 'other'
  }

  private getDeviceInfo(): PerformanceMetric['device'] {
    if (typeof window === 'undefined') return undefined

    const ua = navigator.userAgent
    const screen = window.screen

    let deviceType: 'desktop' | 'tablet' | 'mobile' = 'desktop'
    if (screen.width <= 768) deviceType = 'mobile'
    else if (screen.width <= 1024) deviceType = 'tablet'

    return {
      type: deviceType,
      os: this.getOS(ua),
      browser: this.getBrowser(ua),
    }
  }

  private getConnectionInfo(): PerformanceMetric['connection'] {
    if (typeof window === 'undefined' || !('connection' in navigator)) return undefined

    const connection = (
      navigator as unknown as {
        connection?: { effectiveType?: string; downlink?: number; rtt?: number }
      }
    ).connection
    if (!connection) return undefined

    return {
      effectiveType: connection.effectiveType || 'unknown',
      downlink: connection.downlink || 0,
      rtt: connection.rtt || 0,
    }
  }

  private getOS(ua: string): string {
    if (ua.includes('Windows')) return 'Windows'
    if (ua.includes('Mac')) return 'macOS'
    if (ua.includes('Linux')) return 'Linux'
    if (ua.includes('Android')) return 'Android'
    if (ua.includes('iOS')) return 'iOS'
    return 'Unknown'
  }

  private getBrowser(ua: string): string {
    if (ua.includes('Chrome')) return 'Chrome'
    if (ua.includes('Firefox')) return 'Firefox'
    if (ua.includes('Safari')) return 'Safari'
    if (ua.includes('Edge')) return 'Edge'
    return 'Unknown'
  }

  private addMetric(metric: PerformanceMetric): void {
    // Apply sampling
    if (Math.random() > this.config.sampleRate) return

    this.metrics.push(metric)

    // Flush if buffer is full
    if (this.metrics.length >= this.config.bufferSize) {
      this.flush()
    }
  }

  private startPeriodicFlush(): void {
    this.flushTimer = setInterval(() => {
      this.flush()
    }, this.config.flushInterval)
  }

  private handleVisibilityChange = (): void => {
    if (document.visibilityState === 'hidden') {
      this.flush()
    }
  }

  private flush = async (): Promise<void> => {
    if (this.metrics.length === 0) return

    const metricsToSend = [...this.metrics]
    this.metrics = []

    try {
      if (this.config.endpoint) {
        await this.sendMetrics(metricsToSend)
      }

      if (this.config.enableConsoleLog && metricsToSend.length > 0) {
        console.log(`[Performance] Flushed ${metricsToSend.length} metrics`)
      }
    } catch (error) {
      console.error('Failed to flush performance metrics:', error)
      // Re-add metrics to buffer if send failed
      this.metrics.unshift(...metricsToSend.slice(-50)) // Keep last 50 metrics
    }
  }

  private async sendMetrics(metrics: PerformanceMetric[]): Promise<void> {
    if (!this.config.endpoint) return

    const payload = {
      metrics,
      metadata: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: Date.now(),
        sessionId: this.sessionId,
      },
    }

    await fetch(this.config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      keepalive: true,
    })
  }

  // Public methods
  public recordCustomMetric(metric: CustomMetric): void {
    if (!this.config.enableCustomMetrics) return

    const performanceMetric: PerformanceMetric = {
      name: `custom_${metric.name}`,
      value: metric.value,
      unit: 'count',
      timestamp: metric.timestamp || Date.now(),
      url: window.location.href,
      sessionId: this.sessionId,
    }

    this.addMetric(performanceMetric)
  }

  public startTimer(name: string): void {
    if (typeof window !== 'undefined' && window.performance) {
      performance.mark(`${name}-start`)
    }
  }

  public endTimer(name: string): void {
    if (typeof window !== 'undefined' && window.performance) {
      performance.mark(`${name}-end`)
      performance.measure(name, `${name}-start`, `${name}-end`)
    }
  }

  public recordPageView(): void {
    this.recordCustomMetric({
      name: 'page_view',
      value: 1,
      labels: {
        url: window.location.pathname,
        referrer: document.referrer,
      },
    })
  }

  public recordUserAction(action: string, details?: Record<string, unknown>): void {
    this.recordCustomMetric({
      name: `user_action_${action}`,
      value: 1,
      labels: details ? Object.fromEntries(Object.entries(details).map(([k, v]) => [k, String(v)])) : undefined,
    })
  }

  public recordApiCall(endpoint: string, duration: number, status: number): void {
    this.recordCustomMetric({
      name: 'api_call_duration',
      value: duration,
      labels: {
        endpoint,
        status: status.toString(),
      },
    })

    this.recordCustomMetric({
      name: 'api_call_count',
      value: 1,
      labels: {
        endpoint,
        status: status.toString(),
      },
    })
  }

  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics]
  }

  public clearMetrics(): void {
    this.metrics = []
  }

  public destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
    }

    if (this.observer) {
      this.observer.disconnect()
    }

    document.removeEventListener('visibilitychange', this.handleVisibilityChange)
    window.removeEventListener('beforeunload', this.flush)

    this.flush()
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor({
  endpoint: '/api/performance',
  enableConsoleLog: process.env.NODE_ENV === 'development',
  sampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
})

// React Hook for performance monitoring
export function usePerformanceMonitor(): {
  recordMetric: (metric: CustomMetric) => void
  startTimer: (name: string) => void
  endTimer: (name: string) => void
  recordPageView: () => void
  recordUserAction: (action: string, details?: Record<string, unknown>) => void
} {
  return React.useMemo(
    () => ({
      recordMetric: (metric: CustomMetric) => {
        performanceMonitor.recordCustomMetric(metric)
      },

      startTimer: (name: string) => {
        performanceMonitor.startTimer(name)
      },

      endTimer: (name: string) => {
        performanceMonitor.endTimer(name)
      },

      recordPageView: () => {
        performanceMonitor.recordPageView()
      },

      recordUserAction: (action: string, details?: Record<string, unknown>) => {
        performanceMonitor.recordUserAction(action, details)
      },
    }),
    []
  )
}

// Higher-order component for automatic performance tracking
export function withPerformanceTracking<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
): React.ComponentType<P> {
  const WithPerformanceTracking = (props: P) => {
    const { startTimer, endTimer } = usePerformanceMonitor()

    React.useEffect(() => {
      const name =
        componentName || WrappedComponent.displayName || WrappedComponent.name || 'Component'
      startTimer(`component_render_${name}`)

      return () => {
        endTimer(`component_render_${name}`)
      }
    }, [startTimer, endTimer])

    return React.createElement(WrappedComponent, props)
  }

  WithPerformanceTracking.displayName = `withPerformanceTracking(${WrappedComponent.displayName || WrappedComponent.name})`

  return WithPerformanceTracking
}

export default PerformanceMonitor
