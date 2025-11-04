// Frontend-only types that extend generated types

export interface User {
  uid: string
  email: string | null
  displayName: string | null
  isAnonymous: boolean
}

export interface Note {
  id: string
  title: string
  content: string
  userId: string
  isPublic?: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateNoteRequest {
  title: string
  content: string
  isPublic?: boolean
}

export interface UpdateNoteRequest {
  title?: string
  content?: string
  isPublic?: boolean
}

export interface AuthError extends Error {
  code?: string
}

export interface ApiError extends Error {
  status?: number
  code?: string
}