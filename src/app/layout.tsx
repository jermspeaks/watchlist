import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { NavHeader } from '@/components/layout/nav-header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Media Watchlist',
  description: 'Track and manage your media consumption across different categories',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <NavHeader />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  )
}
