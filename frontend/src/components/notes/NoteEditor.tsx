'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/stores/authStore'
import { toast } from 'sonner'
import { Save, X } from 'lucide-react'

const noteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  content: z.string().min(1, 'Content is required').max(10000, 'Content must be less than 10000 characters'),
})

type NoteFormData = z.infer<typeof noteSchema>

interface NoteEditorProps {
  initialData?: {
    id: string
    title: string
    content: string
  }
  onSave?: (data: NoteFormData & { id?: string }) => Promise<void> | void
  onCancel?: () => void
  isEditing?: boolean
}

export function NoteEditor({ initialData, onSave, onCancel, isEditing = false }: NoteEditorProps) {
  const { user } = useAuthStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
    },
  })

  const contentLength = watch('content')?.length || 0

  const onSubmit = async (data: NoteFormData) => {
    if (!user) {
      toast.error('You must be signed in to save notes')
      return
    }

    try {
      setIsSubmitting(true)
      
      // Call the onSave prop or implement default save logic
      if (onSave) {
        await onSave({
          ...data,
          id: initialData?.id,
        })
      } else {
        // Placeholder for default save logic - will be replaced with API call
        console.log('Saving note:', { ...data, userId: user.uid })
        toast.success(isEditing ? 'Note updated successfully!' : 'Note created successfully!')
      }
      
      if (!isEditing) {
        reset()
      }
    } catch (error) {
      toast.error('Failed to save note. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      reset()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isEditing ? 'Edit Note' : 'Create New Note'}
          {user?.isAnonymous && (
            <Badge variant="secondary" className="text-xs">
              Anonymous
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter note title..."
              {...register('title')}
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="content">Content</Label>
              <span className="text-xs text-muted-foreground">
                {contentLength}/10000 characters
              </span>
            </div>
            <textarea
              id="content"
              placeholder="Write your note content here..."
              rows={8}
              className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              {...register('content')}
              disabled={isSubmitting}
            />
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            {isEditing && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSubmitting || !isDirty}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting 
                ? 'Saving...' 
                : isEditing 
                  ? 'Update Note' 
                  : 'Save Note'
              }
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}