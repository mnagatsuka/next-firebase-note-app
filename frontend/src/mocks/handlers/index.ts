import { http, HttpResponse } from 'msw'
import type { 
  NoteListResponse, 
  NoteResponse, 
  PrivateNoteListResponse, 
  PrivateNoteResponse,
  AuthResponse,
  UserProfileResponse,
  SessionResponse
} from '@/lib/api/generated/schemas'

// Mock data using OpenAPI examples (no faker dependency)
const mockPublicNotes: NoteListResponse = {
  status: 'success',
  data: {
    notes: [
      {
        id: 'note-1',
        title: 'Welcome to Simple Notes',
        content: 'This is a sample public note. Start by creating your own notes in "My Notebook"! Simple Notes is designed to be your personal notebook that grows with you.',
        author: 'Simple Notes Team',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
        isPublic: true
      },
      {
        id: 'note-2',
        title: 'Getting Started Guide',
        content: 'Click on "My Notebook" to create your first private note. No signup required - just start writing! Your notes are automatically saved.',
        author: null,
        createdAt: '2024-01-14T15:20:00Z',
        updatedAt: '2024-01-14T15:20:00Z',
        isPublic: true
      }
    ],
    pagination: {
      page: 1,
      limit: 10,
      total: 2,
      hasNext: false,
      hasPrev: false
    }
  }
}

const mockPrivateNotes: PrivateNoteListResponse = {
  status: 'success',
  data: {
    notes: [
      {
        id: 'private-note-1',
        userId: 'user-123',
        title: 'My First Private Note',
        content: 'This is my private note that only I can see. I can write anything here!',
        createdAt: '2024-01-16T09:00:00Z',
        updatedAt: '2024-01-16T09:15:00Z'
      }
    ],
    pagination: {
      page: 1,
      limit: 10,
      total: 1,
      hasNext: false,
      hasPrev: false
    }
  }
}

// API Handlers
export const handlers = [
  // Public Notes
  http.get('*/notes', () => {
    return HttpResponse.json(mockPublicNotes)
  }),

  http.get('*/notes/:id', ({ params }) => {
    const noteId = params.id as string
    const note = mockPublicNotes.data.notes.find(n => n.id === noteId)
    
    if (!note) {
      return HttpResponse.json(
        { status: 'error', error: { code: 'NOT_FOUND', message: 'Note not found' } },
        { status: 404 }
      )
    }

    const response: NoteResponse = {
      status: 'success',
      data: note
    }
    return HttpResponse.json(response)
  }),

  // Private Notes
  http.get('*/me/notes', ({ request }) => {
    const auth = request.headers.get('Authorization')
    if (!auth) {
      return HttpResponse.json(
        { status: 'error', error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      )
    }
    return HttpResponse.json(mockPrivateNotes)
  }),

  http.post('*/me/notes', ({ request }) => {
    const auth = request.headers.get('Authorization')
    if (!auth) {
      return HttpResponse.json(
        { status: 'error', error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      )
    }

    const newNote: PrivateNoteResponse = {
      status: 'success',
      data: {
        id: `note-${Date.now()}`,
        userId: 'user-123',
        title: 'New Note',
        content: 'Note content',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
    return HttpResponse.json(newNote, { status: 201 })
  }),

  http.delete('*/me/notes/:id', ({ request }) => {
    const auth = request.headers.get('Authorization')
    if (!auth) {
      return HttpResponse.json(
        { status: 'error', error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      )
    }
    return new HttpResponse(null, { status: 204 })
  }),

  // User Profile
  http.get('*/me', ({ request }) => {
    const auth = request.headers.get('Authorization')
    if (!auth) {
      return HttpResponse.json(
        { status: 'error', error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      )
    }

    const profile: UserProfileResponse = {
      status: 'success',
      data: {
        userId: 'user-123',
        displayName: 'Test User',
        avatarUrl: null,
        settings: {
          locale: 'en',
          theme: 'system',
          editor: 'rich'
        },
        isAnonymous: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-16T10:00:00Z'
      }
    }
    return HttpResponse.json(profile)
  }),

  // Authentication
  http.post('*/auth/anonymous', () => {
    const response: AuthResponse = {
      status: 'success',
      data: {
        message: 'Anonymous user registered and authenticated',
        userRegistered: true,
        isAnonymous: true
      }
    }
    return HttpResponse.json(response)
  }),

  http.post('*/auth/login', () => {
    const response: AuthResponse = {
      status: 'success',
      data: {
        message: 'User logged in successfully',
        userRegistered: false,
        isAnonymous: false
      }
    }
    return HttpResponse.json(response)
  }),

  http.post('*/auth/signup', () => {
    const response: AuthResponse = {
      status: 'success',
      data: {
        message: 'Account created successfully',
        userRegistered: true,
        isAnonymous: false
      }
    }
    return HttpResponse.json(response, { status: 201 })
  }),

  http.post('*/auth/promote', () => {
    const response: AuthResponse = {
      status: 'success',
      data: {
        message: 'Account upgraded successfully. All your notes have been preserved.',
        userUpgraded: true,
        isAnonymous: false
      }
    }
    return HttpResponse.json(response)
  }),

  http.post('*/auth/logout', () => {
    const response: AuthResponse = {
      status: 'success',
      data: {
        message: 'Logged out successfully'
      }
    }
    return HttpResponse.json(response)
  }),

  http.get('*/auth/session', () => {
    const response: SessionResponse = {
      status: 'success',
      data: {
        uid: 'user-123',
        email: 'test@example.com',
        emailVerified: true,
        isAnonymous: false,
        customClaims: null
      }
    }
    return HttpResponse.json(response)
  })
]