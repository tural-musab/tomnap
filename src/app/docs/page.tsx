'use client'

import React from 'react'
import dynamic from 'next/dynamic'

// Dynamically import Swagger UI to avoid SSR issues
const SwaggerUI = dynamic(
  () => import('swagger-ui-react').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }
)

export default function ApiDocsPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            TomNAP API Documentation
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive API documentation for TomNAP social e-commerce platform. 
            Build amazing video shopping experiences with our RESTful API.
          </p>
        </div>

        {/* Quick Links */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border bg-card">
            <h3 className="font-semibold mb-2">🚀 Getting Started</h3>
            <p className="text-sm text-muted-foreground">
              Start with authentication and basic API calls
            </p>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <h3 className="font-semibold mb-2">🎥 Videos API</h3>
            <p className="text-sm text-muted-foreground">
              Create and manage video content
            </p>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <h3 className="font-semibold mb-2">🛒 Products API</h3>
            <p className="text-sm text-muted-foreground">
              Manage products and inventory
            </p>
          </div>
        </div>

        {/* Swagger UI */}
        <div className="bg-card rounded-lg border overflow-hidden">
          <SwaggerUI
            url="/api/docs"
            deepLinking={true}
            displayRequestDuration={true}
            docExpansion="list"
            filter={true}
            showExtensions={true}
            showCommonExtensions={true}
            tryItOutEnabled={true}
            requestInterceptor={(request) => {
              // Add authorization header if token exists
              const token = localStorage.getItem('supabase.auth.token')
              if (token) {
                request.headers.Authorization = `Bearer ${token}`
              }
              return request
            }}
            onComplete={(system) => {
              console.log('Swagger UI loaded:', system)
            }}
          />
        </div>

        {/* Additional Resources */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">📚 Additional Resources</h2>
            <div className="space-y-2">
              <a 
                href="/docs/postman" 
                className="block p-3 rounded border hover:bg-accent transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                📮 Postman Collection
              </a>
              <a 
                href="https://github.com/tural-musab/tomnap" 
                className="block p-3 rounded border hover:bg-accent transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                💻 GitHub Repository
              </a>
              <a 
                href="mailto:support@tomnap.com" 
                className="block p-3 rounded border hover:bg-accent transition-colors"
              >
                📧 API Support
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">🔧 Developer Tools</h2>
            <div className="space-y-2">
              <div className="p-3 rounded border">
                <h4 className="font-medium">Base URL (Production)</h4>
                <code className="text-sm text-muted-foreground">
                  https://tomnap.com/api
                </code>
              </div>
              <div className="p-3 rounded border">
                <h4 className="font-medium">Base URL (Staging)</h4>
                <code className="text-sm text-muted-foreground">
                  https://staging.tomnap.com/api
                </code>
              </div>
              <div className="p-3 rounded border">
                <h4 className="font-medium">Rate Limits</h4>
                <code className="text-sm text-muted-foreground">
                  100 req/min (GET), 10-50 req/min (POST)
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* SDK Information */}
        <div className="mt-12 p-6 rounded-lg border bg-muted/20">
          <h2 className="text-2xl font-bold mb-4">🛠️ SDKs & Libraries</h2>
          <p className="text-muted-foreground mb-4">
            Official and community SDKs for popular programming languages:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded border bg-card">
              <div className="text-2xl mb-2">🟨</div>
              <h4 className="font-medium">JavaScript/TypeScript</h4>
              <p className="text-sm text-muted-foreground">Official SDK</p>
            </div>
            <div className="text-center p-4 rounded border bg-card">
              <div className="text-2xl mb-2">🐍</div>
              <h4 className="font-medium">Python</h4>
              <p className="text-sm text-muted-foreground">Community</p>
            </div>
            <div className="text-center p-4 rounded border bg-card">
              <div className="text-2xl mb-2">☕</div>
              <h4 className="font-medium">Java</h4>
              <p className="text-sm text-muted-foreground">Community</p>
            </div>
            <div className="text-center p-4 rounded border bg-card">
              <div className="text-2xl mb-2">💎</div>
              <h4 className="font-medium">Ruby</h4>
              <p className="text-sm text-muted-foreground">Community</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}