"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Home, LayoutGrid, Search, ShoppingCart, User } from 'lucide-react'

const FloatingDock = () => {
  const pathname = usePathname()
  const [clientPath, setClientPath] = useState<string>("")
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setClientPath(pathname ?? "")
  }, [pathname])
  useEffect(() => setMounted(true), [])
  const isActive = (href: string) => (mounted && clientPath === href)

  const itemBase = 'inline-flex items-center justify-center rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70'

  return (
    <div className="pointer-events-none fixed left-0 right-0 bottom-0 z-50 flex justify-center">
      <div className="pointer-events-auto mb-[calc(env(safe-area-inset-bottom)+12px)] w-full max-w-[640px] px-4">
        <nav className="rounded-3xl bg-white/10 backdrop-blur-xl ring-1 ring-white/20 px-3 py-3">
          <ul className="flex items-center justify-between">
            <li>
              <Link aria-label="Home" href="/home" className={`${itemBase} h-12 w-12 ${isActive('/home') ? 'bg-gradient-to-br from-purple-600 to-pink-600' : 'hover:bg-white/10'}`}>
                <Home className="h-6 w-6 text-white" />
              </Link>
            </li>
            <li>
              <Link aria-label="Keşfet" href="/explore" className={`${itemBase} h-12 w-12 ${isActive('/explore') ? 'bg-gradient-to-br from-purple-600 to-pink-600' : 'hover:bg-white/10'}`}>
                <LayoutGrid className="h-6 w-6 text-white" />
              </Link>
            </li>
            <li>
              <Link aria-label="Sepet" href="/cart" className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">
                <ShoppingCart className="h-7 w-7 text-white" />
                <span className="absolute -top-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold">3</span>
              </Link>
            </li>
            <li>
              <Link aria-label="Ara" href="/search" className={`${itemBase} h-12 w-12 ${isActive('/search') ? 'bg-gradient-to-br from-purple-600 to-pink-600' : 'hover:bg-white/10'}`}>
                <Search className="h-6 w-6 text-white" />
              </Link>
            </li>
            <li>
              <Link aria-label="Profil" href="/dashboard" className={`${itemBase} h-12 w-12 ${isActive('/dashboard') ? 'bg-gradient-to-br from-purple-600 to-pink-600' : 'hover:bg-white/10'}`}>
                <User className="h-6 w-6 text-white" />
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default FloatingDock


