import { describe, it, expect } from 'vitest'
import { GET } from '../health/route'
import { NextRequest } from 'next/server'

// Mock Supabase client
const mockSupabaseClient = {
  from: () => ({
    select: () => ({
      limit: () => Promise.resolve({ data: [], error: null })
    })
  })
}

// Mock the createClient function
vi.mock('@/lib/supabase/server', () => ({
  createClient: () => Promise.resolve(mockSupabaseClient)
}))

describe('/api/health', () => {
  it('should return health status with 200', async () => {
    const request = new NextRequest('http://localhost:3000/api/health')
    const response = await GET(request)
    
    expect(response.status).toBe(200)
    
    const data = await response.json()
    expect(data).toHaveProperty('status')
    expect(data).toHaveProperty('timestamp')
    expect(data).toHaveProperty('uptime')
    expect(data).toHaveProperty('environment')
    expect(data).toHaveProperty('version')
    expect(data).toHaveProperty('services')
    expect(data.services).toHaveProperty('database')
    expect(data.services).toHaveProperty('app')
  })

  it('should have correct data types', async () => {
    const request = new NextRequest('http://localhost:3000/api/health')
    const response = await GET(request)
    const data = await response.json()
    
    expect(typeof data.status).toBe('string')
    expect(typeof data.timestamp).toBe('string')
    expect(typeof data.uptime).toBe('number')
    expect(typeof data.environment).toBe('string')
    expect(typeof data.version).toBe('string')
    expect(typeof data.services).toBe('object')
  })

  it('should include database status', async () => {
    const request = new NextRequest('http://localhost:3000/api/health')
    const response = await GET(request)
    const data = await response.json()
    
    expect(data.services.database).toHaveProperty('status')
    expect(data.services.database).toHaveProperty('latency')
    expect(['healthy', 'unhealthy', 'error']).toContain(data.services.database.status)
  })

  it('should include app status with memory info', async () => {
    const request = new NextRequest('http://localhost:3000/api/health')
    const response = await GET(request)
    const data = await response.json()
    
    expect(data.services.app).toHaveProperty('status')
    expect(data.services.app).toHaveProperty('memory')
    expect(data.services.app.memory).toHaveProperty('used')
    expect(data.services.app.memory).toHaveProperty('total')
    expect(typeof data.services.app.memory.used).toBe('number')
    expect(typeof data.services.app.memory.total).toBe('number')
  })

  it('should return valid JSON response', async () => {
    const request = new NextRequest('http://localhost:3000/api/health')
    const response = await GET(request)
    
    expect(response.headers.get('Content-Type')).toContain('application/json')
    
    const data = await response.json()
    expect(typeof data).toBe('object')
    expect(data).not.toBeNull()
  })
})