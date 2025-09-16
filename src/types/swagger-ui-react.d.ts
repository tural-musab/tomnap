declare module 'swagger-ui-react' {
  import React from 'react'
  
  interface SwaggerUIProps {
    spec?: object
    url?: string
    layout?: string
    docExpansion?: 'list' | 'full' | 'none'
    defaultModelsExpandDepth?: number
    defaultModelExpandDepth?: number
    [key: string]: any
  }
  
  const SwaggerUI: React.FC<SwaggerUIProps>
  export default SwaggerUI
}

declare module 'swagger-ui-react/swagger-ui.css'