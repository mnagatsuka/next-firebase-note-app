import Link from 'next/link'
import { getPublicNote } from '@/lib/api/generated/client'
import { notFound } from 'next/navigation'

type PageProps = {
  params: { id: string }
}

export default async function PublicNotePage({ params }: PageProps) {
  const { id } = params

  try {
    const res = await getPublicNote(id)
    const note = res.data

    return (
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Link href="/" className="text-sm text-muted-foreground hover:underline">← Back to Home</Link>
        </div>

        <article className="prose max-w-none">
          <h1>{note.title}</h1>
          <p className="text-sm text-muted-foreground">
            {new Date(note.updatedAt).toLocaleString()}
            {note.author ? ` • by ${note.author}` : ''}
          </p>
          <div className="mt-6 whitespace-pre-wrap">
            {note.content}
          </div>
        </article>
      </div>
    )
  } catch (e) {
    // If not found or any fetch error, render 404 page
    notFound()
  }
}

