'use client'

import Link from 'next/link'
import { ShoppingBag, Search, User, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-purple-600 to-pink-600 text-white">
            <ShoppingBag className="h-4 w-4" />
          </span>
          <span className="text-base font-semibold">TomNAP</span>
        </Link>

        <div className="hidden flex-1 items-center justify-center sm:flex">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="h-9 pl-9" placeholder="Ara (⌘K)" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Ara" className="sm:hidden">
            <Search className="h-5 w-5" />
          </Button>
          <Link href="/login">
            <Button variant="ghost" size="icon" aria-label="Hesabım">
              <User className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/cart">
            <Button variant="ghost" size="icon" aria-label="Sepet">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  )
}
