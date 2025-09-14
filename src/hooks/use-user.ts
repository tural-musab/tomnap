'use client'

import { useEffect } from 'react'
import { useUserStore } from '@/stores/user-store'

export function useUser() {
  const { user, profile, isLoading } = useUserStore()

  return {
    user,
    profile,
    isLoading,
    isAuthenticated: !!user,
  }
}

export function useRequireAuth(redirectTo = '/login') {
  const { user, isLoading } = useUserStore()

  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = redirectTo
    }
  }, [user, isLoading, redirectTo])

  return { user, isLoading }
}
