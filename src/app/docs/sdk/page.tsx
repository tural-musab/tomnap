import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function SdkPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          TomNAP API SDK
        </h1>
        <p className="text-lg text-muted-foreground">
          Official TypeScript SDK for the TomNAP API with type safety, automatic retries, and error handling.
        </p>
      </div>

      {/* Quick Start */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📦 Installation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg font-mono text-sm">
              <div className="mb-2"># npm</div>
              <div className="mb-4">npm install @tomnap/api-client</div>
              
              <div className="mb-2"># yarn</div>
              <div className="mb-4">yarn add @tomnap/api-client</div>
              
              <div className="mb-2"># pnpm</div>
              <div>pnpm add @tomnap/api-client</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🚀 Basic Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <pre>{`import { TomNAPApiClient } from '@tomnap/api-client'

// Create client instance
const client = new TomNAPApiClient({
  baseUrl: 'https://tomnap.com/api',
  apiKey: 'your-api-key-here'
})

// List products
const products = await client.listProducts({
  page: 0,
  limit: 10,
  category: 'Electronics'
})

// Create a product
const newProduct = await client.createProduct({
  title: 'Amazing Product',
  price: 99.99,
  currency: 'TRY',
  category: 'Electronics',
  images: ['https://example.com/image.jpg'],
  stock_quantity: 100
})`}</pre>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🔒 Type Safety
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Full TypeScript support with auto-completion and compile-time type checking.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🔄 Auto Retry
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Built-in retry mechanism with exponential backoff for failed requests.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ⚡ Error Handling
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Comprehensive error handling with structured error objects.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🔐 Authentication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Simple JWT token management with automatic header injection.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ⏱️ Timeouts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Configurable request timeouts to prevent hanging requests.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🌍 Multi-Environment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Pre-configured clients for production, staging, and local development.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Configuration */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Configuration</h2>
        
        <Card>
          <CardHeader>
            <CardTitle>Client Configuration Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <pre>{`interface TomNAPConfig {
  baseUrl?: string     // API base URL (default: https://tomnap.com/api)
  apiKey?: string      // JWT authentication token
  timeout?: number     // Request timeout in ms (default: 10000)
  retries?: number     // Number of retry attempts (default: 3)
  retryDelay?: number  // Base delay between retries in ms (default: 1000)
}

const client = new TomNAPApiClient({
  baseUrl: 'https://api.tomnap.com',
  apiKey: process.env.TOMNAP_API_KEY,
  timeout: 15000,
  retries: 5,
  retryDelay: 2000
})`}</pre>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Environment Clients */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Environment-Specific Clients</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🌍 Production
                <Badge variant="default">Prod</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-3 rounded font-mono text-xs overflow-x-auto">
                <pre>{`import { createProdClient } from '@tomnap/api-client'

const client = createProdClient('your-api-key')`}</pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🔧 Staging
                <Badge variant="secondary">Stage</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-3 rounded font-mono text-xs overflow-x-auto">
                <pre>{`import { createStagingClient } from '@tomnap/api-client'

const client = createStagingClient('your-api-key')`}</pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🏠 Local
                <Badge variant="outline">Dev</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-3 rounded font-mono text-xs overflow-x-auto">
                <pre>{`import { createLocalClient } from '@tomnap/api-client'

const client = createLocalClient('your-api-key')`}</pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* API Methods */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">API Methods</h2>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Health Check</CardTitle>
              <CardDescription>Monitor API health and dependencies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                <pre>{`// Check API health
const health = await client.getHealth()
console.log(health.status) // 'healthy' | 'unhealthy'`}</pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>Manage products and inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                <pre>{`// List products with filtering
const products = await client.listProducts({
  page: 0,
  limit: 20,
  category: 'Electronics',
  search: 'wireless'
})

// Create a new product
const product = await client.createProduct({
  title: 'Wireless Headphones',
  price: 199.99,
  currency: 'TRY',
  category: 'Electronics',
  images: ['https://example.com/image.jpg'],
  stock_quantity: 50
})`}</pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Videos</CardTitle>
              <CardDescription>Upload and manage video content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                <pre>{`// List videos with sorting
const videos = await client.listVideos({
  page: 0,
  limit: 10,
  sort: 'popular',
  creator_id: 'user-123'
})

// Upload a new video
const video = await client.createVideo({
  title: 'Product Review',
  video_url: 'https://cdn.example.com/video.mp4',
  duration: 120,
  tags: ['review', 'tech']
})`}</pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Error Handling */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Error Handling</h2>
        
        <Card>
          <CardHeader>
            <CardTitle>TomNAPApiError</CardTitle>
            <CardDescription>Structured error handling for API responses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg font-mono text-sm">
              <pre>{`import { TomNAPApiClient, TomNAPApiError } from '@tomnap/api-client'

try {
  const products = await client.listProducts()
  console.log(products.data)
} catch (error) {
  if (error instanceof TomNAPApiError) {
    console.error(\`API Error \${error.statusCode}: \${error.message}\`)
    console.error(\`Error Code: \${error.code}\`)
    console.error(\`Timestamp: \${error.timestamp}\`)
    
    // Handle specific error codes
    switch (error.statusCode) {
      case 401:
        // Handle unauthorized
        redirectToLogin()
        break
      case 429:
        // Handle rate limiting
        showRateLimitWarning()
        break
      case 500:
        // Handle server errors
        showServerErrorMessage()
        break
    }
  } else {
    // Handle network or other errors
    console.error('Network error:', error.message)
  }
}`}</pre>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* TypeScript Types */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">TypeScript Support</h2>
        
        <Card>
          <CardHeader>
            <CardTitle>Available Types</CardTitle>
            <CardDescription>Complete type definitions for all API entities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg font-mono text-sm">
              <pre>{`import type {
  Product,
  Video,
  CreateProductPayload,
  CreateVideoPayload,
  ListProductsParams,
  ListVideosParams,
  ApiResponse,
  ApiError,
  HealthStatus,
  PaginationParams
} from '@tomnap/api-client'

// Fully typed responses
const response: ApiResponse<Product[]> = await client.listProducts()
const products: Product[] = response.data`}</pre>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resources */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Resources</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Documentation</h3>
            <div className="space-y-2">
              <Link 
                href="/docs" 
                className="block p-3 rounded border hover:bg-accent transition-colors"
              >
                📖 API Reference
              </Link>
              <Link 
                href="/docs/postman" 
                className="block p-3 rounded border hover:bg-accent transition-colors"
              >
                📮 Postman Collection
              </Link>
              <a 
                href="https://github.com/tural-musab/tomnap" 
                className="block p-3 rounded border hover:bg-accent transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                💻 GitHub Repository
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <div className="space-y-2">
              <a 
                href="mailto:support@tomnap.com" 
                className="block p-3 rounded border hover:bg-accent transition-colors"
              >
                📧 Email Support
              </a>
              <a 
                href="https://github.com/tural-musab/tomnap/issues" 
                className="block p-3 rounded border hover:bg-accent transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                🐛 Report Issues
              </a>
              <a 
                href="https://github.com/tural-musab/tomnap/discussions" 
                className="block p-3 rounded border hover:bg-accent transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                💬 Community Discussions
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}