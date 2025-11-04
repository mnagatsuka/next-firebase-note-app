import { auth } from '@/lib/firebase/client'
import { 
  signInAnonymously, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  linkWithCredential,
  EmailAuthProvider,
  signOut,
  User 
} from 'firebase/auth'

/**
 * Centralized Authentication Service
 * Follows the authentication flow specification from docs/auth-security/
 */
export class AuthService {
  /**
   * Ensure user is authenticated (creates anonymous user if needed)
   * Per specification: Auto-create anonymous user for private features
   */
  static async ensureAuthenticated(): Promise<User | null> {
    if (auth.currentUser) return auth.currentUser
    
    try {
      const credential = await signInAnonymously(auth)
      const user = credential.user
      
      if (user) {
        // Bridge to backend per authentication spec
        await this.createSessionCookie(user, '/api/auth/anonymous')
      }
      
      return user
    } catch (error) {
      console.error('Anonymous authentication failed:', error)
      return null
    }
  }
  
  /**
   * Sign up with email/password
   * Handles both anonymous promotion and new user creation
   */
  static async signUpWithEmail(email: string, password: string): Promise<void> {
    const currentUser = auth.currentUser
    
    if (currentUser?.isAnonymous) {
      // Anonymous promotion via linkWithCredential (preserves UID and data)
      const credential = EmailAuthProvider.credential(email, password)
      const linkedUser = await linkWithCredential(currentUser, credential)
      await this.createSessionCookie(linkedUser.user, '/api/auth/promote', { email })
    } else {
      // New regular user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await this.createSessionCookie(userCredential.user, '/api/auth/signup', { email })
    }
  }
  
  /**
   * Sign in with email/password for existing users
   */
  static async signInWithEmail(email: string, password: string): Promise<void> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    await this.createSessionCookie(userCredential.user, '/api/auth/login')
  }
  
  /**
   * Sign out current user
   * Clears both Firebase auth and session cookie
   */
  static async signOut(): Promise<void> {
    try {
      // Clear session cookie first
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Failed to clear session cookie:', error)
    }
    
    // Sign out from Firebase
    await signOut(auth)
  }
  
  /**
   * Get current authentication status
   */
  static getAuthStatus(): {
    user: User | null
    isAuthenticated: boolean
    isAnonymous: boolean
    isRegular: boolean
  } {
    const user = auth.currentUser
    return {
      user,
      isAuthenticated: !!user,
      isAnonymous: !!user?.isAnonymous,
      isRegular: !!user && !user.isAnonymous,
    }
  }
  
  /**
   * Get fresh authentication token
   */
  static async getAuthToken(): Promise<string | null> {
    const user = auth.currentUser
    
    if (!user) {
      return null
    }
    
    try {
      return await user.getIdToken()
    } catch (error) {
      console.error('Failed to get auth token:', error)
      return null
    }
  }
  
  /**
   * Private helper: Create session cookie via API bridge
   */
  private static async createSessionCookie(
    user: User, 
    endpoint: string, 
    body?: object
  ): Promise<void> {
    const token = await user.getIdToken()
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    
    if (!response.ok) {
      throw new Error(`Session cookie creation failed: ${response.status}`)
    }
  }
}

/**
 * Helper function to determine if an endpoint requires authentication
 */
export function isPrivateEndpoint(url: string): boolean {
  return url.includes('/me/') || url.includes('/me') || url.includes('/auth/')
}

// Backward compatibility exports
export const ensureAuthenticated = AuthService.ensureAuthenticated
export const getAuthToken = AuthService.getAuthToken
