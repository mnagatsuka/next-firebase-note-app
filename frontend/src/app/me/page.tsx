'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useModalStore } from '@/stores/modalStore'
import { Button } from '@/components/ui/button'
import { NoteCard } from '@/components/notes/NoteCard'
import { NoteEditor } from '@/components/notes/NoteEditor'
import { useGetUserNotes, useCreateUserNote, useDeleteUserNote } from '@/lib/api/generated/client'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

export default function MyNotebookPage() {
  const { user, isLoading, ensureAuthenticated } = useAuthStore()
  const { openSignup } = useModalStore()
  const [showEditor, setShowEditor] = useState(false)

  // API hooks
  const { 
    data: notesResponse, 
    isLoading: notesLoading, 
    error: notesError,
    refetch: refetchNotes 
  } = useGetUserNotes({}, {
    enabled: !!user && !user.isAnonymous
  })

  const createNoteMutation = useCreateUserNote({
    onSuccess: () => {
      toast.success('Note created successfully!')
      setShowEditor(false)
      refetchNotes()
    },
    onError: (error) => {
      toast.error('Failed to create note')
      console.error('Create note error:', error)
    }
  })

  const deleteNoteMutation = useDeleteUserNote({
    onSuccess: () => {
      toast.success('Note deleted successfully!')
      refetchNotes()
    },
    onError: (error) => {
      toast.error('Failed to delete note')
      console.error('Delete note error:', error)
    }
  })

  useEffect(() => {
    // Auto-authenticate when accessing private notebook
    if (!user && !isLoading) {
      ensureAuthenticated()
    }
  }, [user, isLoading, ensureAuthenticated])

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading your notebook...</p>
          </div>
        </div>
      </div>
    )
  }

  const notes = notesResponse?.data.notes || []

  const handleCreateNote = async (data: { title: string; content: string }) => {
    createNoteMutation.mutate({
      data: {
        title: data.title,
        content: data.content
      }
    })
  }

  const handleDeleteNote = (noteId: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      deleteNoteMutation.mutate({ id: noteId })
    }
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Notebook</h1>
          {user?.isAnonymous && (
            <p className="text-muted-foreground mt-2">
              You're using an anonymous account. 
              <Button 
                variant="link" 
                className="p-0 h-auto text-primary"
                onClick={openSignup}
              >
                Create an account
              </Button> to access your notes from any device.
            </p>
          )}
        </div>
        <Button onClick={() => setShowEditor(!showEditor)}>
          <Plus className="w-4 h-4 mr-2" />
          {showEditor ? 'Cancel' : 'New Note'}
        </Button>
      </div>

      {/* Note Editor */}
      {showEditor && (
        <div className="mb-8">
          <NoteEditor
            onSave={handleCreateNote}
            onCancel={() => setShowEditor(false)}
          />
        </div>
      )}

      {/* Loading State */}
      {notesLoading && (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading your notes...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {notesError && (
        <div className="text-center py-16">
          <p className="text-destructive mb-4">Failed to load your notes.</p>
          <Button variant="outline" onClick={() => refetchNotes()}>
            Try Again
          </Button>
        </div>
      )}

      {/* Notes Grid */}
      {!notesLoading && !notesError && (
        <>
          {notes.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {notes.map(note => (
                <NoteCard 
                  key={note.id} 
                  note={note}
                  showActions={true}
                  onDelete={handleDeleteNote}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <h2 className="text-xl font-medium mb-4">Start Your First Note</h2>
                <p className="text-muted-foreground mb-8">
                  Your notebook is empty. Create your first note to get started!
                </p>
                <Button onClick={() => setShowEditor(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Note
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}