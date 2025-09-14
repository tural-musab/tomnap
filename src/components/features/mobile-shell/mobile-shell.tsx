"use client"
import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'

import Header from './header'
import FloatingDock from './floating-dock'

interface MobileShellProps {
  children: ReactNode
}

export default function MobileShell({ children }: MobileShellProps) {
  const pathname = usePathname()
  const hideHeader = pathname === '/home' || pathname === '/feed'
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply blur-3xl" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply blur-3xl" />
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply blur-3xl" />
      </div>

      <div className="relative flex min-h-screen flex-col px-4 pb-[calc(env(safe-area-inset-bottom)+90px)] pt-[calc(env(safe-area-inset-top)+8px)] text-white max-w-[640px] mx-auto w-full">
        {hideHeader ? null : (
          <div className="mt-1">
            <Header />
          </div>
        )}
        <main className="mt-4 flex-1">
          {children}
        </main>
      </div>

      <FloatingDock />
    </div>
  )
}


