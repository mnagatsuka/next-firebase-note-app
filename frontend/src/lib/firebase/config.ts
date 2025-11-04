import { initializeApp, getApps, FirebaseApp, type FirebaseOptions } from 'firebase/app'
import { getAuth, connectAuthEmulator, Auth } from 'firebase/auth'
import { clientEnv } from '@/lib/config/env'

// Validate required client envs without relying on process.env enumeration
const missing: string[] = []
if (!clientEnv.NEXT_PUBLIC_FIREBASE_API_KEY) missing.push('NEXT_PUBLIC_FIREBASE_API_KEY')
if (!clientEnv.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) missing.push('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN')
if (!clientEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID) missing.push('NEXT_PUBLIC_FIREBASE_PROJECT_ID')
if (!clientEnv.NEXT_PUBLIC_FIREBASE_APP_ID) missing.push('NEXT_PUBLIC_FIREBASE_APP_ID')

if (missing.length) {
  console.error('Missing required Firebase environment variable(s):', missing)
  throw new Error(`Missing required Firebase environment variable(s): ${missing.join(', ')}`)
}

const firebaseConfig: FirebaseOptions = {
  apiKey: clientEnv.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: clientEnv.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: clientEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  appId: clientEnv.NEXT_PUBLIC_FIREBASE_APP_ID!,
  // Note: We don't use storage or messaging for this app.
  // If you add them later, conditionally include to satisfy exactOptionalPropertyTypes:
  // ...(clientEnv.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? { storageBucket: clientEnv.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET } : {}),
  // ...(clientEnv.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? { messagingSenderId: clientEnv.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID } : {}),
}

// Initialize Firebase app (singleton pattern)
let app: FirebaseApp
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApps()[0]!
}

// Initialize Firebase Auth
export const auth: Auth = getAuth(app)

// Enhanced emulator connection with better error handling
let __authEmulatorConnected = false
if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
	const emulatorHost = clientEnv.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST
	if (emulatorHost && !__authEmulatorConnected) {
		try {
			connectAuthEmulator(auth, `http://${emulatorHost}`, { disableWarnings: true })
			__authEmulatorConnected = true
			console.log("🔥 Connected to Firebase Auth emulator at", emulatorHost)
		} catch (error) {
			console.warn("Firebase Auth emulator connection failed:", error)
			// Continue without emulator - will use production Firebase
		}
	}
}

export { app }
export default app
