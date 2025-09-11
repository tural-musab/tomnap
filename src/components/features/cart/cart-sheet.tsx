'use client'

import { useMemo } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import CartItem from './cart-item'
import CartSummary from './cart-summary'
import { useCartStore } from '@/stores/cart-store'

interface CartSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const { items } = useCartStore()

  const sorted = useMemo(
    () => items.slice().sort((a, b) => a.title.localeCompare(b.title)),
    [items]
  )

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle>Sepet</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-auto py-4">
          {sorted.length === 0 ? (
            <div className="text-sm text-muted-foreground">Sepetiniz boş.</div>
          ) : (
            sorted.map((item) => <CartItem key={item.id} {...item} />)
          )}
        </div>
        <CartSummary />
      </SheetContent>
    </Sheet>
  )
}
