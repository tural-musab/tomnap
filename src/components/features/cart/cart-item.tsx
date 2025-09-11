'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/stores/cart-store'

interface CartItemProps {
  id: string
  product_id: string
  title: string
  price: number
  sale_price?: number
  image: string
  quantity: number
}

export default function CartItem(props: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore()

  const price = props.sale_price ?? props.price
  const total = price * props.quantity

  return (
    <div className="flex gap-3 py-3">
      <div className="relative h-20 w-20 overflow-hidden rounded-md bg-muted">
        {props.image ? (
          <Image src={props.image} alt={props.title} fill className="object-cover" />
        ) : null}
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="font-medium line-clamp-1">{props.title}</div>
            <div className="text-sm text-muted-foreground">{props.quantity} adet</div>
          </div>
          <div className="text-right">
            <div className="font-semibold">{total.toFixed(2)} ₺</div>
            {props.sale_price ? (
              <div className="text-xs text-muted-foreground line-through">
                {props.price.toFixed(2)} ₺
              </div>
            ) : null}
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => updateQuantity(props.product_id, props.quantity - 1)}
          >
            -
          </Button>
          <div className="w-8 text-center">{props.quantity}</div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => updateQuantity(props.product_id, props.quantity + 1)}
          >
            +
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="ml-auto"
            onClick={() => removeItem(props.product_id)}
          >
            Kaldır
          </Button>
        </div>
      </div>
    </div>
  )
}
