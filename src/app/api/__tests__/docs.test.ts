import { describe, it, expect } from 'vitest'
import { GET } from '../docs/route'
import { NextRequest } from 'next/server'

describe('/api/docs', () => {
  it('should return OpenAPI specification with 200', async () => {
    const request = new NextRequest('http://localhost:3000/api/docs')
    const response = await GET(request)
    
    expect(response.status).toBe(200)
    
    const data = await response.json()
    expect(data).toHaveProperty('openapi')
    expect(data).toHaveProperty('info')
    expect(data).toHaveProperty('paths')
    expect(data).toHaveProperty('components')
  })

  it('should have correct OpenAPI version', async () => {
    const request = new NextRequest('http://localhost:3000/api/docs')
    const response = await GET(request)
    const data = await response.json()
    
    expect(data.openapi).toBe('3.0.0')
  })

  it('should include API info', async () => {
    const request = new NextRequest('http://localhost:3000/api/docs')
    const response = await GET(request)
    const data = await response.json()
    
    expect(data.info).toHaveProperty('title')
    expect(data.info).toHaveProperty('version')
    expect(data.info).toHaveProperty('description')
    expect(data.info.title).toBe('TomNAP API')
    expect(data.info.version).toBe('1.0.0')
  })

  it('should include server configurations', async () => {
    const request = new NextRequest('http://localhost:3000/api/docs')
    const response = await GET(request)
    const data = await response.json()
    
    expect(data).toHaveProperty('servers')
    expect(Array.isArray(data.servers)).toBe(true)
    expect(data.servers.length).toBeGreaterThan(0)
    
    const prodServer = data.servers.find((server: any) => 
      server.url === 'https://tomnap.com'
    )
    expect(prodServer).toBeDefined()
    expect(prodServer.description).toBe('Production server')
  })

  it('should include security schemes', async () => {
    const request = new NextRequest('http://localhost:3000/api/docs')
    const response = await GET(request)
    const data = await response.json()
    
    expect(data.components).toHaveProperty('securitySchemes')
    expect(data.components.securitySchemes).toHaveProperty('bearerAuth')
    expect(data.components.securitySchemes.bearerAuth.type).toBe('http')
    expect(data.components.securitySchemes.bearerAuth.scheme).toBe('bearer')
  })

  it('should include common schemas', async () => {
    const request = new NextRequest('http://localhost:3000/api/docs')
    const response = await GET(request)
    const data = await response.json()
    
    expect(data.components).toHaveProperty('schemas')
    expect(data.components.schemas).toHaveProperty('Error')
    expect(data.components.schemas).toHaveProperty('Pagination')
    expect(data.components.schemas).toHaveProperty('User')
    expect(data.components.schemas).toHaveProperty('Product')
    expect(data.components.schemas).toHaveProperty('Video')
    expect(data.components.schemas).toHaveProperty('HealthCheck')
  })

  it('should include API paths', async () => {
    const request = new NextRequest('http://localhost:3000/api/docs')
    const response = await GET(request)
    const data = await response.json()
    
    expect(data).toHaveProperty('paths')
    expect(Object.keys(data.paths).length).toBeGreaterThan(0)
  })

  it('should have proper content type and caching headers', async () => {
    const request = new NextRequest('http://localhost:3000/api/docs')
    const response = await GET(request)
    
    expect(response.headers.get('Content-Type')).toContain('application/json')
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=300, s-maxage=600')
  })

  it('should have proper CORS headers', async () => {
    const request = new NextRequest('http://localhost:3000/api/docs')
    const response = await GET(request)
    
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*')
    expect(response.headers.get('Access-Control-Allow-Methods')).toBe('GET, OPTIONS')
  })
})