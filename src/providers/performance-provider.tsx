'use client'

import React from 'react'
import { usePerformanceMonitor } from '@/lib/performance'

interface PerformanceProviderProps {
  children: React.ReactNode
}

export function PerformanceProvider({ children }: PerformanceProviderProps) {
  const { recordPageView } = usePerformanceMonitor()

  React.useEffect(() => {
    // Record initial page view
    recordPageView()

    // Record page visibility changes for analytics
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        recordPageView()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [recordPageView])

  return <>{children}</>
}