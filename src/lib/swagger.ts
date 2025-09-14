import { createSwaggerSpec } from 'next-swagger-doc'

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: 'src/app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'TomNAP API',
        version: '1.0.0',
        description: `
# TomNAP API Documentation

TomNAP is a social e-commerce platform that combines TikTok-style video content with online shopping.

## Features
- 🎥 Video-based product discovery
- 🛒 Social shopping experiences  
- 👥 User profiles and following
- 📱 Mobile-first design
- 💳 Secure payment processing

## Authentication
Most endpoints require authentication via Supabase Auth. Include the JWT token in the Authorization header:
\`Authorization: Bearer <your-jwt-token>\`

## Rate Limiting
API endpoints are rate-limited to prevent abuse:
- GET endpoints: 100 requests per minute
- POST endpoints: 10-50 requests per minute
- Authenticated users have higher limits

## Error Handling
All errors follow a consistent format:
\`\`\`json
{
  "success": false,
  "error": "Error Type",
  "message": "Human readable error message",
  "statusCode": 400,
  "timestamp": "2024-01-01T00:00:00Z"
}
\`\`\`

## Pagination
List endpoints support pagination:
- \`page\`: Page number (0-based, default: 0)
- \`limit\`: Items per page (default: 10, max: 100)

Response includes pagination metadata:
\`\`\`json
{
  "data": [...],
  "pagination": {
    "page": 0,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
\`\`\`
        `,
        contact: {
          name: 'TomNAP Support',
          email: 'support@tomnap.com',
          url: 'https://tomnap.com/support'
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT'
        }
      },
      servers: [
        {
          url: 'https://tomnap.com',
          description: 'Production server'
        },
        {
          url: 'https://staging.tomnap.com',
          description: 'Staging server'
        },
        {
          url: 'http://localhost:3000',
          description: 'Development server'
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Supabase JWT token'
          }
        },
        schemas: {
          Error: {
            type: 'object',
            properties: {
              success: {
                type: 'boolean',
                example: false
              },
              error: {
                type: 'string',
                example: 'Validation Error'
              },
              message: {
                type: 'string',
                example: 'Invalid request parameters'
              },
              statusCode: {
                type: 'integer',
                example: 400
              },
              timestamp: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-01T00:00:00Z'
              }
            }
          },
          Pagination: {
            type: 'object',
            properties: {
              page: {
                type: 'integer',
                minimum: 0,
                example: 0
              },
              limit: {
                type: 'integer',
                minimum: 1,
                maximum: 100,
                example: 10
              },
              total: {
                type: 'integer',
                minimum: 0,
                example: 100
              },
              totalPages: {
                type: 'integer',
                minimum: 0,
                example: 10
              }
            }
          },
          User: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                example: '123e4567-e89b-12d3-a456-426614174000'
              },
              username: {
                type: 'string',
                example: 'johndoe'
              },
              full_name: {
                type: 'string',
                nullable: true,
                example: 'John Doe'
              },
              avatar_url: {
                type: 'string',
                format: 'uri',
                nullable: true,
                example: 'https://example.com/avatar.jpg'
              },
              bio: {
                type: 'string',
                nullable: true,
                example: 'Fashion enthusiast and content creator'
              },
              role: {
                type: 'string',
                enum: ['customer', 'vendor', 'influencer', 'admin'],
                example: 'customer'
              },
              is_verified: {
                type: 'boolean',
                example: false
              },
              follower_count: {
                type: 'integer',
                minimum: 0,
                example: 1250
              },
              following_count: {
                type: 'integer',
                minimum: 0,
                example: 180
              },
              created_at: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-01T00:00:00Z'
              }
            },
            required: ['id', 'username', 'role']
          },
          Product: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                example: '456e7890-e89b-12d3-a456-426614174001'
              },
              title: {
                type: 'string',
                example: 'Premium Wireless Headphones'
              },
              description: {
                type: 'string',
                nullable: true,
                example: 'High-quality wireless headphones with noise cancellation'
              },
              price: {
                type: 'number',
                format: 'float',
                minimum: 0,
                example: 299.99
              },
              sale_price: {
                type: 'number',
                format: 'float',
                minimum: 0,
                nullable: true,
                example: 249.99
              },
              currency: {
                type: 'string',
                example: 'TRY'
              },
              images: {
                type: 'array',
                items: {
                  type: 'string',
                  format: 'uri'
                },
                example: ['https://example.com/product1.jpg', 'https://example.com/product2.jpg']
              },
              category: {
                type: 'string',
                example: 'Electronics'
              },
              subcategory: {
                type: 'string',
                nullable: true,
                example: 'Audio'
              },
              brand: {
                type: 'string',
                nullable: true,
                example: 'TechBrand'
              },
              stock_quantity: {
                type: 'integer',
                minimum: 0,
                example: 50
              },
              is_active: {
                type: 'boolean',
                example: true
              },
              vendor_id: {
                type: 'string',
                format: 'uuid',
                example: '789e0123-e89b-12d3-a456-426614174002'
              },
              created_at: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-01T00:00:00Z'
              }
            },
            required: ['id', 'title', 'price', 'currency', 'category', 'vendor_id']
          },
          Video: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                example: '321e6547-e89b-12d3-a456-426614174003'
              },
              title: {
                type: 'string',
                example: 'Unboxing Premium Headphones'
              },
              description: {
                type: 'string',
                nullable: true,
                example: 'Check out these amazing wireless headphones!'
              },
              video_url: {
                type: 'string',
                format: 'uri',
                example: 'https://cdn.tomnap.com/videos/video123.mp4'
              },
              thumbnail_url: {
                type: 'string',
                format: 'uri',
                nullable: true,
                example: 'https://cdn.tomnap.com/thumbnails/thumb123.jpg'
              },
              duration: {
                type: 'integer',
                minimum: 1,
                example: 45
              },
              view_count: {
                type: 'integer',
                minimum: 0,
                example: 15420
              },
              like_count: {
                type: 'integer',
                minimum: 0,
                example: 892
              },
              comment_count: {
                type: 'integer',
                minimum: 0,
                example: 156
              },
              share_count: {
                type: 'integer',
                minimum: 0,
                example: 45
              },
              status: {
                type: 'string',
                enum: ['processing', 'active', 'inactive', 'deleted'],
                example: 'active'
              },
              creator_id: {
                type: 'string',
                format: 'uuid',
                example: '654e9876-e89b-12d3-a456-426614174004'
              },
              creator: {
                $ref: '#/components/schemas/User'
              },
              video_products: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    product: {
                      $ref: '#/components/schemas/Product'
                    },
                    timestamp: {
                      type: 'integer',
                      minimum: 0,
                      example: 15
                    }
                  }
                }
              },
              created_at: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-01T00:00:00Z'
              }
            },
            required: ['id', 'title', 'video_url', 'duration', 'status', 'creator_id']
          },
          HealthCheck: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                enum: ['healthy', 'unhealthy'],
                example: 'healthy'
              },
              timestamp: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-01T00:00:00Z'
              },
              uptime: {
                type: 'number',
                example: 3600.5
              },
              environment: {
                type: 'string',
                example: 'production'
              },
              version: {
                type: 'string',
                example: '1.0.0'
              },
              services: {
                type: 'object',
                properties: {
                  database: {
                    type: 'object',
                    properties: {
                      status: {
                        type: 'string',
                        enum: ['healthy', 'unhealthy', 'error']
                      },
                      latency: {
                        type: 'string',
                        example: '25ms'
                      }
                    }
                  },
                  app: {
                    type: 'object',
                    properties: {
                      status: {
                        type: 'string',
                        enum: ['healthy', 'unhealthy', 'error']
                      },
                      memory: {
                        type: 'object',
                        properties: {
                          used: {
                            type: 'number',
                            example: 128.5
                          },
                          total: {
                            type: 'number',
                            example: 512.0
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          BadRequest: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                },
                example: {
                  success: false,
                  error: 'Validation Error',
                  message: 'Invalid request parameters',
                  statusCode: 400,
                  timestamp: '2024-01-01T00:00:00Z'
                }
              }
            }
          },
          Unauthorized: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                },
                example: {
                  success: false,
                  error: 'Unauthorized',
                  message: 'Authentication required',
                  statusCode: 401,
                  timestamp: '2024-01-01T00:00:00Z'
                }
              }
            }
          },
          Forbidden: {
            description: 'Forbidden',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                },
                example: {
                  success: false,
                  error: 'Forbidden',
                  message: 'Insufficient permissions',
                  statusCode: 403,
                  timestamp: '2024-01-01T00:00:00Z'
                }
              }
            }
          },
          NotFound: {
            description: 'Not Found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                },
                example: {
                  success: false,
                  error: 'Not Found',
                  message: 'Resource not found',
                  statusCode: 404,
                  timestamp: '2024-01-01T00:00:00Z'
                }
              }
            }
          },
          RateLimit: {
            description: 'Too Many Requests',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                },
                example: {
                  success: false,
                  error: 'Rate Limit Exceeded',
                  message: 'Too many requests',
                  statusCode: 429,
                  timestamp: '2024-01-01T00:00:00Z'
                }
              }
            }
          },
          ServerError: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                },
                example: {
                  success: false,
                  error: 'Server Error',
                  message: 'Internal server error',
                  statusCode: 500,
                  timestamp: '2024-01-01T00:00:00Z'
                }
              }
            }
          }
        }
      },
      security: [
        {
          bearerAuth: []
        }
      ]
    }
  })

  return spec
}