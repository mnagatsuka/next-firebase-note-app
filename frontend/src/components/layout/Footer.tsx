import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="text-sm text-muted-foreground">
              © 2024 Simple Notes. All rights reserved.
            </div>
          </div>
          
          <nav className="flex items-center space-x-6">
            <Link 
              href="/about" 
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              About
            </Link>
            <Link 
              href="/privacy" 
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Privacy
            </Link>
            <Link 
              href="/terms" 
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Terms
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}