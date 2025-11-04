'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, Mail, Calendar } from 'lucide-react'

export default function AccountPage() {
  const { user, isLoading, ensureAuthenticated } = useAuthStore()

  useEffect(() => {
    // Ensure user is authenticated
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
            <p>Loading account...</p>
          </div>
        </div>
      </div>
    )
  }

  // Redirect anonymous users to upgrade flow
  if (user?.isAnonymous) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Create Your Account</CardTitle>
              <CardDescription>
                You're currently using an anonymous account. Create a full account to access your notes from any device.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your-email@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Create a password" />
              </div>
              <Button className="w-full">
                Create Account
              </Button>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Button variant="link" className="p-0 h-auto">
                    Sign in
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your profile and account preferences.
          </p>
        </div>

        {/* Account Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Account Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="default">Regular Account</Badge>
              <span className="text-sm text-muted-foreground">
                Full access to all features
              </span>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4" />
                <span>{user?.email || 'No email provided'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4" />
                <span>Account created: {user ? new Date().toLocaleDateString() : 'Unknown'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>
              Update your profile information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input 
                id="displayName" 
                defaultValue={user?.displayName || ''} 
                placeholder="Your display name" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                defaultValue={user?.email || ''} 
                placeholder="your-email@example.com" 
              />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible and destructive actions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}