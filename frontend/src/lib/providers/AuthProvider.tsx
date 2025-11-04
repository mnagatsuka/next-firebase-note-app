'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth)
  const authInitialized = useAuthStore((state) => state.authInitialized)

  useEffect(() => {
    // Initialize authentication state management
    if (!authInitialized) {
      initializeAuth()
    }
  }, [authInitialized, initializeAuth])

  return <>{children}</>
}