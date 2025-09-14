import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'

// Common validation schemas
export const paginationSchema = z.object({
  page: z.string().optional().default('0').transform((val) => parseInt(val, 10)),
  limit: z.string().optional().default('10').transform((val) => Math.min(parseInt(val, 10), 100)),
  offset: z.string().optional().transform((val) => val ? parseInt(val, 10) : undefined),
})

export const idSchema = z.object({
  id: z.string().uuid('Invalid ID format')
})

// Product schemas
export const createProductSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().max(2000).optional(),
  price: z.number().positive('Price must be positive'),
  sale_price: z.number().positive().optional(),
  currency: z.string().default('TRY'),
  images: z.array(z.string().url()).min(1, 'At least one image required'),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  tags: z.array(z.string()).optional(),
  sku: z.string().optional(),
  stock_quantity: z.number().int().min(0).default(0),
  specs: z.record(z.any()).optional(),
  variants: z.array(z.any()).optional(),
  shipping_info: z.record(z.any()).optional(),
})

export const updateProductSchema = createProductSchema.partial()

// Video schemas
export const createVideoSchema = z.object({
  video_url: z.string().url('Invalid video URL'),
  thumbnail_url: z.string().url('Invalid thumbnail URL'),
  hls_url: z.string().url().optional(),
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().max(2000).optional(),
  duration: z.number().positive('Duration must be positive'),
  music_info: z.record(z.any()).optional(),
  hashtags: z.array(z.string()).optional(),
  is_shoppable: z.boolean().default(false),
})

export const updateVideoSchema = createVideoSchema.partial()

// Video-Product association schema
export const createVideoProductSchema = z.object({
  video_id: z.string().uuid('Invalid video ID'),
  product_id: z.string().uuid('Invalid product ID'),
  timestamp_start: z.number().min(0).optional(),
  timestamp_end: z.number().min(0).optional(),
  x_position: z.number().min(0).max(100).optional(),
  y_position: z.number().min(0).max(100).optional(),
})

// Profile schemas
export const updateProfileSchema = z.object({
  username: z.string().min(3).max(32).regex(/^[a-zA-Z0-9_]+$/, 'Invalid username format').optional(),
  full_name: z.string().min(2).max(80).optional(),
  website: z.string().url().optional().or(z.literal('').transform(() => undefined)),
  location: z.string().max(80).optional(),
  bio: z.string().max(300).optional(),
  avatar_url: z.string().url().optional(),
})

// Order schemas
export const createOrderSchema = z.object({
  items: z.array(z.object({
    product_id: z.string().uuid(),
    quantity: z.number().int().positive(),
    price: z.number().positive(),
    variant: z.record(z.any()).optional(),
  })).min(1, 'Order must have at least one item'),
  shipping_address: z.object({
    name: z.string().min(1),
    address_line1: z.string().min(1),
    address_line2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    postal_code: z.string().min(1),
    country: z.string().default('TR'),
    phone: z.string().optional(),
  }),
  billing_address: z.object({
    name: z.string().min(1),
    address_line1: z.string().min(1),
    address_line2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    postal_code: z.string().min(1),
    country: z.string().default('TR'),
  }).optional(),
  payment_method: z.enum(['cash', 'card', 'bank_transfer']).default('cash'),
  notes: z.string().max(500).optional(),
})

// Generic API response types
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiError {
  error: string
  message: string
  details?: any
  status: number
}

// Validation middleware
export function validateRequestBody<T>(schema: z.ZodSchema<T>) {
  return async (request: NextRequest): Promise<{ success: true; data: T } | { success: false; error: ApiError }> => {
    try {
      const body = await request.json()
      const validatedData = schema.parse(body)
      return { success: true, data: validatedData }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: {
            error: 'Validation Error',
            message: 'Invalid request body',
            details: error.errors,
            status: 400
          }
        }
      }
      return {
        success: false,
        error: {
          error: 'Parse Error',
          message: 'Invalid JSON format',
          status: 400
        }
      }
    }
  }
}

export function validateSearchParams<T>(schema: z.ZodSchema<T>) {
  return (searchParams: URLSearchParams): { success: true; data: T } | { success: false; error: ApiError } => {
    try {
      const params = Object.fromEntries(searchParams.entries())
      const validatedData = schema.parse(params)
      return { success: true, data: validatedData }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: {
            error: 'Validation Error',
            message: 'Invalid query parameters',
            details: error.errors,
            status: 400
          }
        }
      }
      return {
        success: false,
        error: {
          error: 'Parse Error',
          message: 'Invalid query parameters',
          status: 400
        }
      }
    }
  }
}

export function validatePathParams<T>(schema: z.ZodSchema<T>) {
  return (params: Record<string, string | string[]>): { success: true; data: T } | { success: false; error: ApiError } => {
    try {
      const validatedData = schema.parse(params)
      return { success: true, data: validatedData }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: {
            error: 'Validation Error',
            message: 'Invalid path parameters',
            details: error.errors,
            status: 400
          }
        }
      }
      return {
        success: false,
        error: {
          error: 'Parse Error',
          message: 'Invalid path parameters',
          status: 400
        }
      }
    }
  }
}

// Error response helper
export function createErrorResponse(error: ApiError): NextResponse<ApiResponse> {
  return NextResponse.json(
    { error: error.error, message: error.message, details: error.details },
    { status: error.status }
  )
}

// Success response helper
export function createSuccessResponse<T>(data: T, message?: string, pagination?: any): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    data,
    message,
    pagination
  })
}

// Rate limiting helper (basic implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(identifier: string, maxRequests: number = 100, windowMs: number = 60000): boolean {
  const now = Date.now()
  const current = rateLimitMap.get(identifier)
  
  if (!current || now > current.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (current.count >= maxRequests) {
    return false
  }
  
  current.count += 1
  return true
}

// Security headers helper
export function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  return response
}

// CORS helper
export function addCorsHeaders(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' ? 'https://tomnap.com' : '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Max-Age', '86400')
  return response
}