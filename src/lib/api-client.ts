/**
 * TomNAP API Client SDK
 * 
 * A TypeScript SDK for the TomNAP API that provides type-safe API calls
 * with automatic retries, error handling, and authentication.
 */

export interface TomNAPConfig {
  baseUrl?: string
  apiKey?: string
  timeout?: number
  retries?: number
  retryDelay?: number
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiError {
  success: false
  error: string
  message: string
  statusCode: number
  timestamp: string
}

export interface Product {
  id: string
  title: string
  description?: string
  price: number
  sale_price?: number
  currency: string
  images: string[]
  category: string
  subcategory?: string
  brand?: string
  stock_quantity: number
  is_active: boolean
  vendor_id: string
  tags?: string[]
  weight?: number
  dimensions?: {
    length?: number
    width?: number
    height?: number
    unit?: string
  }
  shipping_info?: {
    free_shipping?: boolean
    shipping_cost?: number
    estimated_delivery_days?: number
  }
  created_at: string
  updated_at: string
}

export interface CreateProductPayload {
  title: string
  description?: string
  price: number
  sale_price?: number
  currency?: string
  images: string[]
  category: string
  subcategory?: string
  brand?: string
  stock_quantity: number
  tags?: string[]
  weight?: number
  dimensions?: {
    length?: number
    width?: number
    height?: number
    unit?: string
  }
  shipping_info?: {
    free_shipping?: boolean
    shipping_cost?: number
    estimated_delivery_days?: number
  }
}

export interface Video {
  id: string
  title: string
  description?: string
  video_url: string
  thumbnail_url?: string
  duration: number
  view_count: number
  like_count: number
  comment_count: number
  share_count: number
  status: 'processing' | 'active' | 'inactive' | 'deleted'
  creator_id: string
  creator?: {
    id: string
    username: string
    avatar_url?: string
    is_verified: boolean
    follower_count: number
  }
  video_products?: Array<{
    product: Product
    timestamp: number
  }>
  created_at: string
  updated_at: string
}

export interface CreateVideoPayload {
  title: string
  description?: string
  video_url: string
  thumbnail_url?: string
  duration: number
  tags?: string[]
  is_public?: boolean
  allow_comments?: boolean
  allow_downloads?: boolean
}

export interface ListProductsParams extends PaginationParams {
  category?: string
  search?: string
}

export interface ListVideosParams extends PaginationParams {
  creator_id?: string
  sort?: 'newest' | 'oldest' | 'popular' | 'trending'
}

export interface HealthStatus {
  status: 'healthy' | 'unhealthy'
  timestamp: string
  uptime: number
  environment: string
  version: string
  services: {
    database: {
      status: 'healthy' | 'unhealthy' | 'error'
      latency: string
    }
    app: {
      status: 'healthy' | 'unhealthy' | 'error'
      memory: {
        used: number
        total: number
      }
    }
  }
  checks?: Record<string, boolean>
}

export class TomNAPApiError extends Error {
  public statusCode: number
  public code: string
  public timestamp: string

  constructor(error: ApiError) {
    super(error.message)
    this.name = 'TomNAPApiError'
    this.statusCode = error.statusCode
    this.code = error.error
    this.timestamp = error.timestamp
  }
}

export class TomNAPApiClient {
  private baseUrl: string
  private apiKey?: string
  private timeout: number
  private retries: number
  private retryDelay: number

  constructor(config: TomNAPConfig = {}) {
    this.baseUrl = config.baseUrl || 'https://tomnap.com/api'
    this.apiKey = config.apiKey
    this.timeout = config.timeout || 10000
    this.retries = config.retries || 3
    this.retryDelay = config.retryDelay || 1000
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers = new Headers(options.headers)
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }
    if (this.apiKey) {
      headers.set('Authorization', `Bearer ${this.apiKey}`)
    }

    const requestOptions: RequestInit = {
      ...options,
      headers,
    }

    // Add timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)
    requestOptions.signal = controller.signal

    let lastError: Error
    
    for (let attempt = 0; attempt <= this.retries; attempt++) {
      try {
        const response = await fetch(url, requestOptions)
        clearTimeout(timeoutId)

        if (!response.ok) {
          const errorData: ApiError = await response.json()
          throw new TomNAPApiError(errorData)
        }

        const data: T = await response.json()
        return data
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error')
        
        if (attempt < this.retries) {
          await new Promise(resolve => 
            setTimeout(resolve, this.retryDelay * Math.pow(2, attempt))
          )
        }
      }
    }

    throw lastError!
  }

  private buildQueryString(params: Record<string, any>): string {
    const filteredParams = Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&')
    
    return filteredParams ? `?${filteredParams}` : ''
  }

  // Health Check
  async getHealth(): Promise<HealthStatus> {
    return this.request<HealthStatus>('/health')
  }

  // Products API
  async listProducts(params: ListProductsParams = {}): Promise<ApiResponse<Product[]>> {
    const queryString = this.buildQueryString(params)
    return this.request<ApiResponse<Product[]>>(`/products${queryString}`)
  }

  async createProduct(payload: CreateProductPayload): Promise<ApiResponse<Product>> {
    return this.request<ApiResponse<Product>>('/products', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  // Videos API
  async listVideos(params: ListVideosParams = {}): Promise<ApiResponse<Video[]>> {
    const queryString = this.buildQueryString(params)
    return this.request<ApiResponse<Video[]>>(`/videos${queryString}`)
  }

  async createVideo(payload: CreateVideoPayload): Promise<ApiResponse<Video>> {
    return this.request<ApiResponse<Video>>('/videos', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  // Authentication
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey
  }

  clearApiKey(): void {
    this.apiKey = undefined
  }

  // Configuration
  setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl
  }

  setTimeout(timeout: number): void {
    this.timeout = timeout
  }

  setRetries(retries: number): void {
    this.retries = retries
  }
}

// Default instance for convenience
export const tomnapApi = new TomNAPApiClient()

// Environment-specific instances
export const createProdClient = (apiKey?: string) => 
  new TomNAPApiClient({
    baseUrl: 'https://tomnap.com/api',
    apiKey,
  })

export const createStagingClient = (apiKey?: string) => 
  new TomNAPApiClient({
    baseUrl: 'https://staging.tomnap.com/api',
    apiKey,
  })

export const createLocalClient = (apiKey?: string) => 
  new TomNAPApiClient({
    baseUrl: 'http://localhost:3000/api',
    apiKey,
  })

// Type exports for consumers are already declared above

// Example usage:
/*
import { TomNAPApiClient, createProdClient } from '@tomnap/api-client'

// Using the default instance
import { tomnapApi } from '@tomnap/api-client'

tomnapApi.setApiKey('your-api-key')

try {
  const products = await tomnapApi.listProducts({ 
    page: 0, 
    limit: 10,
    category: 'Electronics'
  })
  console.log(products.data)
} catch (error) {
  if (error instanceof TomNAPApiError) {
    console.error(`API Error ${error.statusCode}: ${error.message}`)
  }
}

// Using environment-specific client
const client = createProdClient('your-api-key')
const health = await client.getHealth()
*/