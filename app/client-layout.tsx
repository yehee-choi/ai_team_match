'use client'

import { initSeedData } from '@/lib/seed'
import Navbar from '@/components/layout/Navbar'

initSeedData()

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
    </>
  )
}