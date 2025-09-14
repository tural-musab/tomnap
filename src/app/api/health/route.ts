import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Check database connection
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
    
    const dbStatus = error ? 'unhealthy' : 'healthy'
    const dbLatency = Date.now() - startTime

    // Basic health check response
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      services: {
        database: {
          status: dbStatus,
          latency: `${dbLatency}ms`
        },
        app: {
          status: 'healthy',
          memory: {
            used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
            total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
          }
        }
      },
      checks: {
        database: dbStatus === 'healthy',
        memory: process.memoryUsage().heapUsed < 500 * 1024 * 1024, // Less than 500MB
        response_time: dbLatency < 1000 // Less than 1 second
      }
    }

    // Determine overall status
    const allChecksHealthy = Object.values(healthData.checks).every(check => check === true)
    const overallStatus = allChecksHealthy ? 'healthy' : 'unhealthy'
    const statusCode = allChecksHealthy ? 200 : 503

    return NextResponse.json(
      { ...healthData, status: overallStatus },
      { status: statusCode }
    )

  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        services: {
          database: { status: 'error' },
          app: { status: 'error' }
        }
      },
      { status: 503 }
    )
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}