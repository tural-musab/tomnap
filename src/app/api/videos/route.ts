import { NextRequest } from 'next/server'
import { sanitizeHtml } from '@/lib/validations'
import { 
  createVideoSchema, 
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
    if (!checkRateLimit(`videos:${clientIp}`, 100, 60000)) {
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
    const { data: videos, error, count } = await supabase
      .from('videos')
      .select(`
        *,
        creator:profiles!creator_id(
          id, username, avatar_url, is_verified, follower_count
        ),
        video_products(*, product:products(*))
      `, { count: 'exact' })
      .eq('status', 'active')
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })
    
    if (error) {
      return createErrorResponse({
        error: 'Database Error',
        message: error.message,
        status: 500
      })
    }
    
    const response = createSuccessResponse(videos, 'Videos retrieved successfully', {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit)
    })
    
    response.headers.set('Cache-Control', 'public, max-age=30, s-maxage=120, stale-while-revalidate=300')
    
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
    if (!checkRateLimit(`videos:post:${clientIp}`, 5, 60000)) {
      return createErrorResponse({
        error: 'Rate Limit Exceeded',
        message: 'Too many requests',
        status: 429
      })
    }
    
    // Validate request body
    const validation = await validateRequestBody(createVideoSchema)(request)
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
      creator_id: user.id,
      title: sanitizeHtml(data.title),
      description: data.description ? sanitizeHtml(data.description) : null,
      status: 'processing' as const, // Initial status
    }
    
    // Insert video
    const { data: video, error } = await supabase
      .from('videos')
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
    
    const response = createSuccessResponse(video, 'Video uploaded successfully')
    return addSecurityHeaders(response)
    
  } catch (error) {
    return createErrorResponse({
      error: 'Server Error',
      message: 'Internal server error',
      status: 500
    })
  }
}
