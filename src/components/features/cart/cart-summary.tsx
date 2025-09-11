'use client'

import { useCartStore } from '@/stores/cart-store'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'

export default function CartSummary() {
  const { totalItems, totalPrice, clearCart } = useCartStore()

  const count = totalItems()
  const total = totalPrice()

  return (
    <div className="border-t pt-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Toplam ({count})</div>
        <div className="text-lg font-semibold">{formatPrice(total)}</div>
      </div>
      <div className="mt-3 flex gap-2">
        <Button className="flex-1">Ödemeye Geç</Button>
        <Button variant="outline" onClick={clearCart}>
          Temizle
        </Button>
      </div>
    </div>
  )
}
