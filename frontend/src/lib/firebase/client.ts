import { initializeApp, getApps, type FirebaseApp, type FirebaseOptions } from 'firebase/app'
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth'
import { clientEnv } from '@/lib/config/env'

const missing: string[] = []
if (!clientEnv.NEXT_PUBLIC_FIREBASE_API_KEY) missing.push('NEXT_PUBLIC_FIREBASE_API_KEY')
if (!clientEnv.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) missing.push('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN')
if (!clientEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID) missing.push('NEXT_PUBLIC_FIREBASE_PROJECT_ID')
if (!clientEnv.NEXT_PUBLIC_FIREBASE_APP_ID) missing.push('NEXT_PUBLIC_FIREBASE_APP_ID')
if (missing.length) {
  throw new Error(`Missing required Firebase environment variable(s): ${missing.join(', ')}`)
}

const firebaseConfig: FirebaseOptions = {
  apiKey: clientEnv.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: clientEnv.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: clientEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  appId: clientEnv.NEXT_PUBLIC_FIREBASE_APP_ID!,
}

let app: FirebaseApp
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApps()[0]!
}

export const auth: Auth = getAuth(app)

// Connect to emulator in development
let __authEmulatorConnected = false
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  const emulatorHost = clientEnv.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST
  if (emulatorHost && !__authEmulatorConnected) {
    try {
      connectAuthEmulator(auth, `http://${emulatorHost}`, { disableWarnings: true })
      __authEmulatorConnected = true
      // eslint-disable-next-line no-console
      console.log('🔥 Connected to Firebase Auth emulator at', emulatorHost)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Firebase Auth emulator connection failed:', e)
    }
  }
}

export { app }
export default app

