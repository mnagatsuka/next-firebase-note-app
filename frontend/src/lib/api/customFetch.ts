import { AuthService, isPrivateEndpoint } from '@/lib/auth/authService'
import { getApiBaseUrl } from '@/lib/config/env'

// Main export for Orval
export const customFetch = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  // For BFF pattern: route non-API relative URLs via Next proxy
  const baseUrl = getApiBaseUrl()
  const isAbsolute = /^https?:\/\//.test(url)
  const isApiLocal = url.startsWith('/api/')
  const normalized = url.startsWith('/') ? url : `/${url}`
  const fullUrl = isAbsolute
    ? url
    : isApiLocal
      ? normalized
      : `/api/proxy${normalized}`
  
  // Auto-authentication for private endpoints per specification
  if (isPrivateEndpoint(url)) {
    await AuthService.ensureAuthenticated()
  }
  
  // Get fresh token if available
  const token = await AuthService.getAuthToken()
  
  const response = await fetch(fullUrl, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    credentials: 'include', // Include session cookies
  })

  if (!response.ok) {
    // Enhanced error handling per specification
    if (response.status === 401) {
      throw new Error('Authentication required')
    }
    if (response.status === 403) {
      throw new Error('Access forbidden - account required')
    }
    if (response.status >= 500) {
      throw new Error('Server error - please try again later')
    }
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// Alternative export for backward compatibility
export const authenticatedFetch = customFetch

// Re-export from authService for consistency
export { isPrivateEndpoint } from '@/lib/auth/authService'

// Default export for Orval
export default customFetch
