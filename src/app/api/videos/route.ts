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

/**
 * @swagger
 * /api/videos:
 *   get:
 *     tags:
 *       - Videos
 *     summary: List videos
 *     description: Retrieve a paginated list of active videos with creator and product information
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number (0-based)
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *       - name: limit
 *         in: query
 *         description: Number of items per page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *       - name: creator_id
 *         in: query
 *         description: Filter by creator ID
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: sort
 *         in: query
 *         description: Sort order
 *         required: false
 *         schema:
 *           type: string
 *           enum: [newest, oldest, popular, trending]
 *           default: newest
 *     responses:
 *       200:
 *         description: Successfully retrieved videos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Video'
 *                 message:
 *                   type: string
 *                   example: Videos retrieved successfully
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       429:
 *         $ref: '#/components/responses/RateLimit'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
export async function GET(request: NextRequest): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url)
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'anonymous'
    
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

/**
 * @swagger
 * /api/videos:
 *   post:
 *     tags:
 *       - Videos
 *     summary: Upload video
 *     description: Upload a new video (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - video_url
 *               - duration
 *             properties:
 *               title:
 *                 type: string
 *                 example: Unboxing Premium Headphones
 *                 minLength: 1
 *                 maxLength: 200
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: Check out these amazing wireless headphones!
 *                 maxLength: 2000
 *               video_url:
 *                 type: string
 *                 format: uri
 *                 example: https://cdn.tomnap.com/videos/video123.mp4
 *               thumbnail_url:
 *                 type: string
 *                 format: uri
 *                 nullable: true
 *                 example: https://cdn.tomnap.com/thumbnails/thumb123.jpg
 *               duration:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 300
 *                 example: 45
 *                 description: Video duration in seconds
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["unboxing", "tech", "review"]
 *                 maxItems: 20
 *               is_public:
 *                 type: boolean
 *                 default: true
 *               allow_comments:
 *                 type: boolean
 *                 default: true
 *               allow_downloads:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: Video uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Video'
 *                 message:
 *                   type: string
 *                   example: Video uploaded successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       429:
 *         $ref: '#/components/responses/RateLimit'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
export async function POST(request: NextRequest): Promise<Response> {
  try {
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'anonymous'
    
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
      .insert(sanitizedData as any)
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
