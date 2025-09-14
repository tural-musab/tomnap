import { NextRequest } from 'next/server'
import { sanitizeHtml } from '@/lib/validations'
import { 
  createProductSchema, 
  paginationSchema,
  validateRequestBody, 
  validateSearchParams,
  createErrorResponse, 
  createSuccessResponse,
  addSecurityHeaders,
  checkRateLimit
} from '@/lib/api-validation'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientIp = request.ip || request.headers.get('x-forwarded-for') || 'anonymous'
    
    // Rate limiting
    if (!checkRateLimit(`products:${clientIp}`, 60, 60000)) {
      return createErrorResponse({
        error: 'Rate Limit Exceeded',
        message: 'Too many requests',
        status: 429
      })
    }
    
    // Validate query parameters
    const validation = validateSearchParams(paginationSchema)(searchParams)
    if (!validation.success) {
      return createErrorResponse(validation.error)
    }
    
    const { page, limit } = validation.data
    const offset = page * limit
    
    const supabase = await createClient()
    const { data: products, error, count } = await supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })
    
    if (error) {
      return createErrorResponse({
        error: 'Database Error',
        message: error.message,
        status: 500
      })
    }
    
    const response = createSuccessResponse(products, 'Products retrieved successfully', {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit)
    })
    
    response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600')
    
    return addSecurityHeaders(response)
  } catch (error) {
    return createErrorResponse({
      error: 'Server Error',
      message: 'Internal server error',
      status: 500
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = request.ip || request.headers.get('x-forwarded-for') || 'anonymous'
    
    // Rate limiting for POST requests (stricter)
    if (!checkRateLimit(`products:post:${clientIp}`, 10, 60000)) {
      return createErrorResponse({
        error: 'Rate Limit Exceeded',
        message: 'Too many requests',
        status: 429
      })
    }
    
    // Validate request body
    const validation = await validateRequestBody(createProductSchema)(request)
    if (!validation.success) {
      return createErrorResponse(validation.error)
    }
    
    const data = validation.data
    
    // Get current user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return createErrorResponse({
        error: 'Unauthorized',
        message: 'Authentication required',
        status: 401
      })
    }
    
    // Sanitize HTML content
    const sanitizedData = {
      ...data,
      vendor_id: user.id,
      title: sanitizeHtml(data.title),
      description: data.description ? sanitizeHtml(data.description) : null,
    }
    
    // Insert product
    const { data: product, error } = await supabase
      .from('products')
      .insert(sanitizedData)
      .select()
      .single()
    
    if (error) {
      return createErrorResponse({
        error: 'Database Error',
        message: error.message,
        status: 500
      })
    }
    
    const response = createSuccessResponse(product, 'Product created successfully')
    return addSecurityHeaders(response)
    
  } catch (error) {
    return createErrorResponse({
      error: 'Server Error',
      message: 'Internal server error',
      status: 500
    })
  }
}
