import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/lib/providers'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Toaster } from '@/components/ui/toaster'
import { LoginModal } from '@/components/auth/LoginModal'
import { SignUpModal } from '@/components/auth/SignUpModal'
import { MSWProvider } from '@/lib/providers/MSWProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Simple Notes - Your Personal Notebook',
  description: 'A simple note-taking application with anonymous access and account progression.',
  keywords: ['notes', 'notebook', 'personal', 'simple'],
  authors: [{ name: 'Simple Notes Team' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Simple Notes - Your Personal Notebook',
    description: 'A simple note-taking application with anonymous access and account progression.',
    type: 'website',
    locale: 'en_US',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <MSWProvider>
          <Providers>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <LoginModal />
            <SignUpModal />
            <Toaster />
          </Providers>
        </MSWProvider>
      </body>
    </html>
  )
}