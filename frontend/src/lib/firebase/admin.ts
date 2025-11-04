import 'server-only'
import { serverEnv } from '@/lib/config/env'
import { initializeApp, cert, getApps, type App } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

let adminApp: App | undefined

function getServiceAccount() {
  // Prefer full JSON if provided, otherwise individual fields
  const json = serverEnv?.FIREBASE_SERVICE_ACCOUNT_JSON
  if (json) {
    try {
      return JSON.parse(json)
    } catch (e) {
      throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT_JSON')
    }
  }

  const projectId = serverEnv?.FIREBASE_PROJECT_ID
  const clientEmail = serverEnv?.FIREBASE_CLIENT_EMAIL
  let privateKey = serverEnv?.FIREBASE_PRIVATE_KEY

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Missing Firebase Admin credentials')
  }

  // Allow escaped newlines in env
  privateKey = privateKey.replace(/\\n/g, '\n')

  return {
    projectId,
    clientEmail,
    privateKey,
  }
}

export function getAdminApp(): App {
  if (!adminApp) {
    const sa = getServiceAccount()
    if (getApps().length === 0) {
      adminApp = initializeApp({
        credential: cert(sa as any),
        projectId: (sa as any).projectId,
      })
    } else {
      adminApp = getApps()[0]!
    }
  }
  return adminApp!
}

export const adminAuth = () => getAuth(getAdminApp())

