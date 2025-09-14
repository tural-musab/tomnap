import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface PerformanceMetric {
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

interface PerformancePayload {
  metrics: PerformanceMetric[]
  metadata: {
    userAgent: string
    url: string
    timestamp: number
    sessionId: string
  }
}

// Simple in-memory store for development (in production, use Redis or similar)
const metricsStore = new Map<string, PerformanceMetric[]>()
const alertThresholds = {
  web_vitals_lcp: 2500, // Largest Contentful Paint (ms)
  web_vitals_fid: 100,  // First Input Delay (ms)
  web_vitals_cls: 0.1,  // Cumulative Layout Shift (score)
  web_vitals_fcp: 1800, // First Contentful Paint (ms)
  web_vitals_ttfb: 600, // Time to First Byte (ms)
  api_call_duration: 5000, // API call duration (ms)
  navigation_total: 10000  // Total navigation time (ms)
}

/**
 * @swagger
 * /api/performance:
 *   post:
 *     tags:
 *       - Performance
 *     summary: Submit performance metrics
 *     description: Collect client-side performance metrics including Web Vitals and custom metrics
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - metrics
 *               - metadata
 *             properties:
 *               metrics:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: web_vitals_lcp
 *                     value:
 *                       type: number
 *                       example: 1250.5
 *                     unit:
 *                       type: string
 *                       example: ms
 *                     timestamp:
 *                       type: number
 *                       example: 1640995200000
 *                     url:
 *                       type: string
 *                       example: https://tomnap.com/feed
 *                     sessionId:
 *                       type: string
 *                       example: sess_abc123
 *                     device:
 *                       type: object
 *                       properties:
 *                         type:
 *                           type: string
 *                           enum: [desktop, tablet, mobile]
 *                         os:
 *                           type: string
 *                         browser:
 *                           type: string
 *                     connection:
 *                       type: object
 *                       properties:
 *                         effectiveType:
 *                           type: string
 *                         downlink:
 *                           type: number
 *                         rtt:
 *                           type: number
 *               metadata:
 *                 type: object
 *                 properties:
 *                   userAgent:
 *                     type: string
 *                   url:
 *                     type: string
 *                   timestamp:
 *                     type: number
 *                   sessionId:
 *                     type: string
 *     responses:
 *       200:
 *         description: Metrics received successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Performance metrics received
 *                 processed:
 *                   type: integer
 *                   example: 5
 *                 alerts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       metric:
 *                         type: string
 *                       value:
 *                         type: number
 *                       threshold:
 *                         type: number
 *                       severity:
 *                         type: string
 *                         enum: [warning, critical]
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: PerformancePayload = await request.json()
    
    if (!body.metrics || !Array.isArray(body.metrics)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid payload',
        message: 'Metrics array is required'
      }, { status: 400 })
    }

    const processedMetrics: PerformanceMetric[] = []
    const alerts: Array<{
      metric: string
      value: number
      threshold: number
      severity: 'warning' | 'critical'
    }> = []

    // Process each metric
    for (const metric of body.metrics) {
      // Validate metric structure
      if (!metric.name || typeof metric.value !== 'number') {
        continue
      }

      processedMetrics.push(metric)

      // Check for performance alerts
      const threshold = alertThresholds[metric.name as keyof typeof alertThresholds]
      if (threshold && metric.value > threshold) {
        const severity = metric.value > threshold * 1.5 ? 'critical' : 'warning'
        alerts.push({
          metric: metric.name,
          value: metric.value,
          threshold,
          severity
        })
      }
    }

    // Store metrics (in production, send to your analytics service)
    const sessionId = body.metadata.sessionId
    if (!metricsStore.has(sessionId)) {
      metricsStore.set(sessionId, [])
    }
    metricsStore.get(sessionId)!.push(...processedMetrics)

    // Keep only last 1000 entries per session to prevent memory issues
    const sessionMetrics = metricsStore.get(sessionId)!
    if (sessionMetrics.length > 1000) {
      sessionMetrics.splice(0, sessionMetrics.length - 1000)
    }

    // Log critical performance issues
    const criticalAlerts = alerts.filter(alert => alert.severity === 'critical')
    if (criticalAlerts.length > 0) {
      console.warn('Critical performance alerts:', criticalAlerts.map(alert => 
        `${alert.metric}: ${alert.value}${processedMetrics.find(m => m.name === alert.metric)?.unit} (threshold: ${alert.threshold})`
      ).join(', '))
    }

    // In production, you might want to:
    // 1. Send metrics to analytics service (Google Analytics, Mixpanel, etc.)
    // 2. Store in database for historical analysis
    // 3. Send alerts to monitoring service (Slack, Discord, etc.)
    // 4. Update real-time dashboards

    return NextResponse.json({
      success: true,
      message: 'Performance metrics received',
      processed: processedMetrics.length,
      alerts: alerts.length > 0 ? alerts : undefined
    })

  } catch (error) {
    console.error('Performance metrics processing error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Processing Error',
      message: 'Failed to process performance metrics'
    }, { status: 500 })
  }
}

/**
 * @swagger
 * /api/performance:
 *   get:
 *     tags:
 *       - Performance
 *     summary: Get performance analytics
 *     description: Retrieve aggregated performance metrics and analytics data
 *     parameters:
 *       - name: sessionId
 *         in: query
 *         description: Filter by session ID
 *         required: false
 *         schema:
 *           type: string
 *       - name: metric
 *         in: query
 *         description: Filter by metric name
 *         required: false
 *         schema:
 *           type: string
 *       - name: timeRange
 *         in: query
 *         description: Time range for metrics
 *         required: false
 *         schema:
 *           type: string
 *           enum: [1h, 24h, 7d, 30d]
 *           default: 24h
 *       - name: groupBy
 *         in: query
 *         description: Group metrics by field
 *         required: false
 *         schema:
 *           type: string
 *           enum: [device, browser, url, sessionId]
 *     responses:
 *       200:
 *         description: Performance analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     summary:
 *                       type: object
 *                       properties:
 *                         totalSessions:
 *                           type: integer
 *                         totalMetrics:
 *                           type: integer
 *                         avgWebVitals:
 *                           type: object
 *                           properties:
 *                             lcp:
 *                               type: number
 *                             fid:
 *                               type: number
 *                             cls:
 *                               type: number
 *                             fcp:
 *                               type: number
 *                             ttfb:
 *                               type: number
 *                     metrics:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           values:
 *                             type: array
 *                             items:
 *                               type: number
 *                           avg:
 *                             type: number
 *                           p50:
 *                             type: number
 *                           p90:
 *                             type: number
 *                           p95:
 *                             type: number
 *                     alerts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           metric:
 *                             type: string
 *                           count:
 *                             type: integer
 *                           severity:
 *                             type: string
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    const metricFilter = searchParams.get('metric')
    const timeRange = searchParams.get('timeRange') || '24h'
    const groupBy = searchParams.get('groupBy')

    // Calculate time range in milliseconds
    const timeRangeMs = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    }[timeRange] || 24 * 60 * 60 * 1000

    const cutoffTime = Date.now() - timeRangeMs
    let allMetrics: PerformanceMetric[] = []

    // Collect metrics from all sessions or specific session
    if (sessionId && metricsStore.has(sessionId)) {
      allMetrics = metricsStore.get(sessionId)!
    } else {
      // Aggregate from all sessions
      for (const metrics of metricsStore.values()) {
        allMetrics.push(...metrics)
      }
    }

    // Filter by time range
    allMetrics = allMetrics.filter(metric => metric.timestamp > cutoffTime)

    // Filter by metric name if specified
    if (metricFilter) {
      allMetrics = allMetrics.filter(metric => metric.name.includes(metricFilter))
    }

    // Calculate statistics
    const metricGroups = new Map<string, number[]>()
    const deviceStats = new Map<string, number>()
    const browserStats = new Map<string, number>()
    const urlStats = new Map<string, number>()

    for (const metric of allMetrics) {
      // Group by metric name
      if (!metricGroups.has(metric.name)) {
        metricGroups.set(metric.name, [])
      }
      metricGroups.get(metric.name)!.push(metric.value)

      // Collect device stats
      if (metric.device?.type) {
        deviceStats.set(metric.device.type, (deviceStats.get(metric.device.type) || 0) + 1)
      }

      // Collect browser stats
      if (metric.device?.browser) {
        browserStats.set(metric.device.browser, (browserStats.get(metric.device.browser) || 0) + 1)
      }

      // Collect URL stats
      if (metric.url) {
        urlStats.set(metric.url, (urlStats.get(metric.url) || 0) + 1)
      }
    }

    // Calculate Web Vitals averages
    const webVitalsAvg = {
      lcp: calculateAverage(metricGroups.get('web_vitals_lcp') || []),
      fid: calculateAverage(metricGroups.get('web_vitals_fid') || []),
      cls: calculateAverage(metricGroups.get('web_vitals_cls') || []),
      fcp: calculateAverage(metricGroups.get('web_vitals_fcp') || []),
      ttfb: calculateAverage(metricGroups.get('web_vitals_ttfb') || [])
    }

    // Calculate percentiles for each metric
    const metricsStats = Array.from(metricGroups.entries()).map(([name, values]) => ({
      name,
      count: values.length,
      avg: calculateAverage(values),
      p50: calculatePercentile(values, 50),
      p90: calculatePercentile(values, 90),
      p95: calculatePercentile(values, 95),
      min: Math.min(...values),
      max: Math.max(...values)
    }))

    // Count alert violations
    const alertCounts = new Map<string, { warning: number, critical: number }>()
    for (const metric of allMetrics) {
      const threshold = alertThresholds[metric.name as keyof typeof alertThresholds]
      if (threshold && metric.value > threshold) {
        if (!alertCounts.has(metric.name)) {
          alertCounts.set(metric.name, { warning: 0, critical: 0 })
        }
        const severity = metric.value > threshold * 1.5 ? 'critical' : 'warning'
        alertCounts.get(metric.name)![severity]++
      }
    }

    const alerts = Array.from(alertCounts.entries()).map(([metric, counts]) => ({
      metric,
      warningCount: counts.warning,
      criticalCount: counts.critical,
      totalCount: counts.warning + counts.critical
    }))

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalSessions: metricsStore.size,
          totalMetrics: allMetrics.length,
          timeRange,
          avgWebVitals: webVitalsAvg
        },
        metrics: metricsStats,
        breakdown: {
          devices: Object.fromEntries(deviceStats),
          browsers: Object.fromEntries(browserStats),
          topUrls: Object.fromEntries(
            Array.from(urlStats.entries())
              .sort(([,a], [,b]) => b - a)
              .slice(0, 10)
          )
        },
        alerts: alerts.filter(alert => alert.totalCount > 0)
      }
    })

  } catch (error) {
    console.error('Performance analytics error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Analytics Error',
      message: 'Failed to retrieve performance analytics'
    }, { status: 500 })
  }
}

function calculateAverage(values: number[]): number {
  if (values.length === 0) return 0
  return Math.round((values.reduce((sum, val) => sum + val, 0) / values.length) * 100) / 100
}

function calculatePercentile(values: number[], percentile: number): number {
  if (values.length === 0) return 0
  
  const sorted = [...values].sort((a, b) => a - b)
  const index = Math.ceil((percentile / 100) * sorted.length) - 1
  return sorted[Math.max(0, index)]
}

export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}