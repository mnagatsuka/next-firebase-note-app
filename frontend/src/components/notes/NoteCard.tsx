import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate, truncateText } from '@/lib/utils'
import { Edit, Trash2, ExternalLink } from 'lucide-react'
import type { PrivateNote, PublicNote } from '@/lib/api/generated/schemas'

type Note = PrivateNote | (PublicNote & { userId?: string })

interface NoteCardProps {
  note: Note
  showActions?: boolean
  onEdit?: (noteId: string) => void
  onDelete?: (noteId: string) => void
}

export function NoteCard({ note, showActions = false, onEdit, onDelete }: NoteCardProps) {
  const isPublicNote = 'isPublic' in note ? note.isPublic === true : false

  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (isPublicNote) {
      return (
        <Link href={`/notes/${note.id}`} className="block">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            {children}
          </Card>
        </Link>
      )
    }

    return (
      <Card className={showActions ? '' : 'hover:shadow-md transition-shadow'}>
        {children}
      </Card>
    )
  }

  return (
    <CardWrapper>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2">{note.title}</CardTitle>
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            {isPublicNote && (
              <Badge variant="secondary" className="text-xs">
                Public
              </Badge>
            )}
            {isPublicNote && (
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            )}
            {isPublicNote && 'author' in note && note.author && (
              <span className="text-xs text-muted-foreground">
                by {note.author}
              </span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-4">
          {truncateText(note.content, 200)}
        </p>
      </CardContent>

      <CardFooter className="flex justify-between items-center">
        <div className="text-xs text-muted-foreground">
          Updated {formatDate(note.updatedAt)}
        </div>

        {showActions && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onEdit?.(note.id)
              }}
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onDelete?.(note.id)
              }}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        )}
      </CardFooter>
    </CardWrapper>
  )
}