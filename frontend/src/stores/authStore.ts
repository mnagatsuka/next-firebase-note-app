import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase/client'
import { AuthService } from '@/lib/auth/authService'

interface AuthState {
  user: FirebaseUser | null
  isLoading: boolean
  authInitialized: boolean
  error: string | null
  
  // Actions aligned with authentication specification
  initializeAuth: () => Promise<void>
  ensureAuthenticated: () => Promise<FirebaseUser | null>
  signUpWithEmail: (email: string, password: string) => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  clearError: () => void
  
  // Computed state
  isAnonymous: boolean
  isRegular: boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      authInitialized: false,
      error: null,
      
      // Computed state
      get isAnonymous() {
        return !!get().user?.isAnonymous
      },
      get isRegular() {
        const user = get().user
        return !!user && !user.isAnonymous
      },

      initializeAuth: async () => {
        set({ isLoading: true })
        
        return new Promise((resolve) => {
          const unsubscribe = onAuthStateChanged(auth, (user) => {
            set({ 
              user, 
              isLoading: false, 
              authInitialized: true 
            })
            unsubscribe()
            resolve()
          })
        })
      },

      ensureAuthenticated: async () => {
        try {
          set({ isLoading: true, error: null })
          const user = await AuthService.ensureAuthenticated()
          set({ user })
          return user
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Authentication failed'
          set({ error: errorMessage })
          return null
        } finally {
          set({ isLoading: false })
        }
      },

      signUpWithEmail: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null })
          await AuthService.signUpWithEmail(email, password)
          // User state will be updated via onAuthStateChanged
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Sign up failed'
          set({ error: errorMessage })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      signInWithEmail: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null })
          await AuthService.signInWithEmail(email, password)
          // User state will be updated via onAuthStateChanged
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Sign in failed'
          set({ error: errorMessage })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      signOut: async () => {
        try {
          set({ isLoading: true, error: null })
          await AuthService.signOut()
          set({ user: null })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Sign out failed'
          set({ error: errorMessage })
        } finally {
          set({ isLoading: false })
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ 
        user: state.user ? {
          uid: state.user.uid,
          email: state.user.email,
          displayName: state.user.displayName,
          isAnonymous: state.user.isAnonymous,
        } : null,
        authInitialized: state.authInitialized,
      }),
    }
  )
)
