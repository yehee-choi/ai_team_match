'use client'

import { useEffect } from 'react'
import { initSeedData } from '@/lib/seed'
import Navbar from '@/components/layout/Navbar'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    initSeedData()
  }, [])

  return (
    <html lang="ko">
      <body className="bg-gray-50 min-h-screen">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}