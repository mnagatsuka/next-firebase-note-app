'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useModalStore } from '@/stores/modalStore'
import { useAuthStore } from '@/stores/authStore'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type SignUpFormData = z.infer<typeof signupSchema>

export function SignUpModal() {
  const { signupOpen, closeSignup, switchToLogin } = useModalStore()
  const { user, signUpWithEmail, promoteAnonymousUser, isLoading, error } = useAuthStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isAnonymousPromotion = user?.isAnonymous

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setIsSubmitting(true)
      
      if (isAnonymousPromotion) {
        await promoteAnonymousUser(data.email, data.password)
        toast.success('Account created successfully! Your notes have been preserved.')
      } else {
        await signUpWithEmail(data.email, data.password)
        toast.success('Account created successfully!')
      }
      
      closeSignup()
      reset()
    } catch (error) {
      if (isAnonymousPromotion) {
        toast.error('Failed to create account. Please try again.')
      } else {
        toast.error('Sign up failed. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    closeSignup()
    reset()
  }

  return (
    <Dialog open={signupOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isAnonymousPromotion ? 'Create Your Account' : 'Sign Up'}
          </DialogTitle>
          <DialogDescription>
            {isAnonymousPromotion 
              ? 'Convert your anonymous account to keep your notes across devices.'
              : 'Create an account to save your notes and access them from any device.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your-email@example.com"
              {...register('email')}
              disabled={isSubmitting || isLoading}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              {...register('password')}
              disabled={isSubmitting || isLoading}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              {...register('confirmPassword')}
              disabled={isSubmitting || isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
              {error}
            </div>
          )}

          {isAnonymousPromotion && (
            <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
              Your existing notes will be preserved and linked to your new account.
            </div>
          )}

          <div className="space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading 
                ? 'Creating account...' 
                : isAnonymousPromotion 
                  ? 'Create Account'
                  : 'Sign Up'
              }
            </Button>

            {!isAnonymousPromotion && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={switchToLogin}
                  >
                    Sign in
                  </Button>
                </p>
              </div>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}