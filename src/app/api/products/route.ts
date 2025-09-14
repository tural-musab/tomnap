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

/**
 * @swagger
 * /api/products:
 *   get:
 *     tags:
 *       - Products
 *     summary: List products
 *     description: Retrieve a paginated list of active products
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
 *       - name: category
 *         in: query
 *         description: Filter by category
 *         required: false
 *         schema:
 *           type: string
 *       - name: search
 *         in: query
 *         description: Search in product title and description
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved products
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
 *                     $ref: '#/components/schemas/Product'
 *                 message:
 *                   type: string
 *                   example: Products retrieved successfully
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

/**
 * @swagger
 * /api/products:
 *   post:
 *     tags:
 *       - Products
 *     summary: Create product
 *     description: Create a new product (requires authentication)
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
 *               - price
 *               - currency
 *               - category
 *               - images
 *               - stock_quantity
 *             properties:
 *               title:
 *                 type: string
 *                 example: Premium Wireless Headphones
 *                 minLength: 1
 *                 maxLength: 200
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: High-quality wireless headphones with noise cancellation
 *                 maxLength: 2000
 *               price:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 example: 299.99
 *               sale_price:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 nullable: true
 *                 example: 249.99
 *               currency:
 *                 type: string
 *                 example: TRY
 *                 default: TRY
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *                 example: ["https://example.com/product1.jpg", "https://example.com/product2.jpg"]
 *                 minItems: 1
 *                 maxItems: 10
 *               category:
 *                 type: string
 *                 example: Electronics
 *               subcategory:
 *                 type: string
 *                 nullable: true
 *                 example: Audio
 *               brand:
 *                 type: string
 *                 nullable: true
 *                 example: TechBrand
 *               stock_quantity:
 *                 type: integer
 *                 minimum: 0
 *                 example: 50
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["wireless", "audio", "premium"]
 *               weight:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 example: 0.25
 *               dimensions:
 *                 type: object
 *                 properties:
 *                   length:
 *                     type: number
 *                     format: float
 *                     minimum: 0
 *                   width:
 *                     type: number
 *                     format: float
 *                     minimum: 0
 *                   height:
 *                     type: number
 *                     format: float
 *                     minimum: 0
 *                   unit:
 *                     type: string
 *                     default: cm
 *               shipping_info:
 *                 type: object
 *                 properties:
 *                   free_shipping:
 *                     type: boolean
 *                     default: false
 *                   shipping_cost:
 *                     type: number
 *                     format: float
 *                     minimum: 0
 *                   estimated_delivery_days:
 *                     type: integer
 *                     minimum: 1
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *                 message:
 *                   type: string
 *                   example: Product created successfully
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
