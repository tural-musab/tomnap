import { NextResponse } from 'next/server'

export async function GET(): Promise<NextResponse> {
  const postmanCollection = {
    info: {
      _postman_id: "tomnap-api-collection",
      name: "TomNAP API",
      description: "TomNAP Social E-Commerce Platform API Collection",
      version: "1.0.0",
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    auth: {
      type: "bearer",
      bearer: [
        {
          key: "token",
          value: "{{bearer_token}}",
          type: "string"
        }
      ]
    },
    variable: [
      {
        key: "base_url",
        value: "https://tomnap.com/api",
        type: "string"
      },
      {
        key: "staging_url", 
        value: "https://staging.tomnap.com/api",
        type: "string"
      },
      {
        key: "local_url",
        value: "http://localhost:3000/api",
        type: "string"
      },
      {
        key: "bearer_token",
        value: "your_jwt_token_here",
        type: "string"
      }
    ],
    item: [
      {
        name: "Health Check",
        item: [
          {
            name: "Health Check",
            request: {
              method: "GET",
              header: [],
              url: {
                raw: "{{base_url}}/health",
                host: ["{{base_url}}"],
                path: ["health"]
              },
              description: "Check the health status of the application and its dependencies"
            },
            response: []
          }
        ]
      },
      {
        name: "Products",
        item: [
          {
            name: "List Products",
            request: {
              method: "GET",
              header: [],
              url: {
                raw: "{{base_url}}/products?page=0&limit=10",
                host: ["{{base_url}}"],
                path: ["products"],
                query: [
                  {
                    key: "page",
                    value: "0",
                    description: "Page number (0-based)"
                  },
                  {
                    key: "limit",
                    value: "10",
                    description: "Number of items per page"
                  },
                  {
                    key: "category",
                    value: "",
                    description: "Filter by category",
                    disabled: true
                  },
                  {
                    key: "search",
                    value: "",
                    description: "Search in product title and description",
                    disabled: true
                  }
                ]
              },
              description: "Retrieve a paginated list of active products"
            },
            response: []
          },
          {
            name: "Create Product",
            request: {
              method: "POST",
              header: [
                {
                  key: "Content-Type",
                  value: "application/json"
                }
              ],
              auth: {
                type: "bearer",
                bearer: [
                  {
                    key: "token",
                    value: "{{bearer_token}}",
                    type: "string"
                  }
                ]
              },
              body: {
                mode: "raw",
                raw: JSON.stringify({
                  title: "Premium Wireless Headphones",
                  description: "High-quality wireless headphones with noise cancellation",
                  price: 299.99,
                  sale_price: 249.99,
                  currency: "TRY",
                  images: [
                    "https://example.com/product1.jpg",
                    "https://example.com/product2.jpg"
                  ],
                  category: "Electronics",
                  subcategory: "Audio",
                  brand: "TechBrand",
                  stock_quantity: 50,
                  tags: ["wireless", "audio", "premium"],
                  weight: 0.25,
                  dimensions: {
                    length: 20,
                    width: 15,
                    height: 8,
                    unit: "cm"
                  },
                  shipping_info: {
                    free_shipping: true,
                    estimated_delivery_days: 3
                  }
                }, null, 2)
              },
              url: {
                raw: "{{base_url}}/products",
                host: ["{{base_url}}"],
                path: ["products"]
              },
              description: "Create a new product (requires authentication)"
            },
            response: []
          }
        ]
      },
      {
        name: "Videos",
        item: [
          {
            name: "List Videos",
            request: {
              method: "GET",
              header: [],
              url: {
                raw: "{{base_url}}/videos?page=0&limit=10",
                host: ["{{base_url}}"],
                path: ["videos"],
                query: [
                  {
                    key: "page",
                    value: "0",
                    description: "Page number (0-based)"
                  },
                  {
                    key: "limit",
                    value: "10",
                    description: "Number of items per page"
                  },
                  {
                    key: "creator_id",
                    value: "",
                    description: "Filter by creator ID",
                    disabled: true
                  },
                  {
                    key: "sort",
                    value: "newest",
                    description: "Sort order (newest, oldest, popular, trending)"
                  }
                ]
              },
              description: "Retrieve a paginated list of active videos"
            },
            response: []
          },
          {
            name: "Upload Video",
            request: {
              method: "POST",
              header: [
                {
                  key: "Content-Type",
                  value: "application/json"
                }
              ],
              auth: {
                type: "bearer",
                bearer: [
                  {
                    key: "token",
                    value: "{{bearer_token}}",
                    type: "string"
                  }
                ]
              },
              body: {
                mode: "raw",
                raw: JSON.stringify({
                  title: "Unboxing Premium Headphones",
                  description: "Check out these amazing wireless headphones!",
                  video_url: "https://cdn.tomnap.com/videos/video123.mp4",
                  thumbnail_url: "https://cdn.tomnap.com/thumbnails/thumb123.jpg",
                  duration: 45,
                  tags: ["unboxing", "tech", "review"],
                  is_public: true,
                  allow_comments: true,
                  allow_downloads: false
                }, null, 2)
              },
              url: {
                raw: "{{base_url}}/videos",
                host: ["{{base_url}}"],
                path: ["videos"]
              },
              description: "Upload a new video (requires authentication)"
            },
            response: []
          }
        ]
      }
    ],
    event: [
      {
        listen: "prerequest",
        script: {
          exec: [
            "// Add any pre-request scripts here",
            "console.log('Making request to:', pm.request.url);"
          ],
          type: "text/javascript"
        }
      },
      {
        listen: "test",
        script: {
          exec: [
            "// Add global test scripts here",
            "pm.test('Response time is less than 2000ms', function () {",
            "    pm.expect(pm.response.responseTime).to.be.below(2000);",
            "});",
            "",
            "pm.test('Response has success property', function () {",
            "    if (pm.response.code === 200 || pm.response.code === 201) {",
            "        pm.expect(pm.response.json()).to.have.property('success');",
            "    }",
            "});"
          ],
          type: "text/javascript"
        }
      }
    ]
  }

  return NextResponse.json(postmanCollection, {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="tomnap-api.postman_collection.json"',
      'Cache-Control': 'public, max-age=300, s-maxage=600'
    }
  })
}

export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}