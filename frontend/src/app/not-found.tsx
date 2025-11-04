import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="container mx-auto py-16 text-center">
      <div className="max-w-md mx-auto">
        <h1 className="text-6xl font-bold text-muted-foreground mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/">
              Go to Home
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/me">
              My Notebook
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}