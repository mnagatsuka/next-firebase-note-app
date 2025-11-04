'use client'

import { useEffect, useState } from 'react'

interface MSWProviderProps {
  children: React.ReactNode
}

export function MSWProvider({ children }: MSWProviderProps) {
  const [mswReady, setMswReady] = useState(false)

  useEffect(() => {
    const initMsw = async () => {
      // Check if API mocking is enabled via environment variable
      const isMockingEnabled = process.env.NEXT_PUBLIC_API_MOCKING_ENABLED === 'true'
      
      if (typeof window !== 'undefined' && isMockingEnabled) {
        try {
          // Dynamically import MSW when mocking is enabled
          const { worker } = await import('@/mocks/browser')
          await worker.start({
            onUnhandledRequest: 'bypass',
          })
          console.log('MSW started for API mocking')
        } catch (error) {
          console.warn('MSW failed to start:', error)
        }
      }
      setMswReady(true)
    }

    initMsw()
  }, [])

  // Don't render children until MSW is ready when mocking is enabled
  if (!mswReady && process.env.NEXT_PUBLIC_API_MOCKING_ENABLED === 'true') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading development environment...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}