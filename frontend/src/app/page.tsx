import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { listPublicNotes } from '@/lib/api/generated/client'

async function getPublicNotes() {
  try {
    // Use generated API call
    return await listPublicNotes({ page: 1, limit: 10 })
  } catch (error) {
    console.error('Failed to fetch public notes:', error)
    // Return empty data on error
    return {
      status: 'success' as const,
      data: { notes: [] as any[], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } }
    }
  }
}

function NoteCardSkeleton() {
  return (
    <div className="p-6 border rounded-lg space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  )
}

function PublicNoteCard({ note }: { note: any }) {
  return (
    <Link href={`/notes/${note.id}`}>
      <div className="p-6 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
        <h2 className="text-xl font-semibold mb-2">{note.title}</h2>
        <div className="text-sm text-muted-foreground mb-4 flex items-center justify-between">
          <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
          {note.author && (
            <span className="text-xs">by {note.author}</span>
          )}
        </div>
        <p className="text-sm line-clamp-3">{note.content}</p>
      </div>
    </Link>
  )
}

export default async function HomePage() {
  const response = await getPublicNotes()
  const notes = response.data.notes || []

  return (
    <div className="container mx-auto py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Simple Notes</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Your personal notebook. Start writing immediately, no signup required.
        </p>
        <Button asChild size="lg">
          <Link href="/me">
            Start My Notebook →
          </Link>
        </Button>
      </div>

      {/* Latest Public Notes */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Latest Public Notes</h2>
        <Suspense fallback={
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <NoteCardSkeleton key={i} />
            ))}
          </div>
        }>
          {notes.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {notes.map(note => (
                <PublicNoteCard key={note.id} note={note} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No public notes available yet.</p>
            </div>
          )}
        </Suspense>
      </section>
    </div>
  )
}