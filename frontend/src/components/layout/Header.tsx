'use client'

import Link from 'next/link'
import { useAuthStore } from '@/stores/authStore'
import { useModalStore } from '@/stores/modalStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User, LogOut, Settings } from 'lucide-react'

export function Header() {
  const { user, logout } = useAuthStore()
  const { openLogin, openSignup } = useModalStore()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-xl font-bold">Simple Notes</div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Home
            </Link>
            <Link 
              href="/me" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              My Notebook
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* User Status */}
                <div className="hidden sm:flex items-center space-x-2">
                  {user.isAnonymous ? (
                    <Badge variant="secondary">Anonymous</Badge>
                  ) : (
                    <div className="flex items-center space-x-2 text-sm">
                      <User className="w-4 h-4" />
                      <span>{user.displayName || user.email || 'User'}</span>
                    </div>
                  )}
                </div>

                {/* Account Actions */}
                {user.isAnonymous ? (
                  <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={openLogin}>
                      Sign In
                    </Button>
                    <Button size="sm" onClick={openSignup}>
                      Create Account
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button asChild variant="ghost" size="sm">
                      <Link href="/account">
                        <Settings className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              /* Not authenticated */
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={openLogin}>
                  Sign In
                </Button>
                <Button size="sm" onClick={openSignup}>
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}