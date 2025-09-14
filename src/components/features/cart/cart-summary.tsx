'use client'

import { useCartStore } from '@/stores/cart-store'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { usePerformanceMonitor } from '@/lib/performance'

export default function CartSummary() {
  const { totalItems, totalPrice, clearCart } = useCartStore()
  const supabase = createClient()
  const { recordUserAction, startTimer, endTimer, recordMetric } = usePerformanceMonitor()

  const count = totalItems()
  const total = totalPrice()

  return (
    <div className="border-t pt-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Toplam ({count})</div>
        <div className="text-lg font-semibold">{formatPrice(total)}</div>
      </div>
      <div className="mt-3 flex gap-2">
        <Button
          className="flex-1"
          onClick={async () => {
            startTimer('checkout_process')
            recordUserAction('checkout_start', { items: count, total })
            
            const {
              data: { user },
            } = await supabase.auth.getUser()
            if (!user) {
              recordUserAction('checkout_redirect_login')
              window.location.href = '/login'
              return
            }
            const items = useCartStore.getState().items
            if (items.length === 0) {
              endTimer('checkout_process')
              return
            }
            const subtotal = items.reduce((s, it) => s + (it.sale_price || it.price) * it.quantity, 0)
            const orderInsert = {
              user_id: user.id,
              order_number: `TN-${Date.now()}`,
              subtotal,
              tax: 0,
              shipping: 0,
              total: subtotal,
              currency: 'TRY',
              items: items.map((it) => ({
                product_id: it.product_id,
                quantity: it.quantity,
                price: it.sale_price || it.price,
              })),
              notes: 'stub-order',
            } satisfies Omit<import('@/types/database.types').Database['public']['Tables']['orders']['Insert'], 'created_at' | 'updated_at' | 'id'>

            const { data: orderRow, error } = await supabase
              .from('orders')
              .insert(orderInsert as any)
              .select('id')
              .single()
            if (!error && orderRow) {
              const orderItems: import('@/types/database.types').Database['public']['Tables']['order_items']['Insert'][] = items.map((it) => ({
                order_id: orderRow.id,
                product_id: it.product_id,
                vendor_id: it.vendor_id,
                quantity: it.quantity,
                unit_price: (it.sale_price || it.price) as number,
                subtotal: ((it.sale_price || it.price) as number) * it.quantity,
                status: 'pending',
              }))
              await supabase.from('order_items').insert(orderItems)
              
              endTimer('checkout_process')
              recordUserAction('checkout_success', { 
                order_id: orderRow.id, 
                items: count, 
                total 
              })
              recordMetric({ 
                name: 'order_value', 
                value: subtotal,
                labels: { currency: 'TRY', items: count.toString() }
              })
              
              clearCart()
              window.location.href = '/profile'
            } else {
              endTimer('checkout_process')
              recordUserAction('checkout_error', { error: error?.message || 'unknown' })
              recordMetric({ name: 'checkout_error', value: 1 })
            }
          }}
        >
          Ödemeye Geç
        </Button>
        <Button 
          variant="outline" 
          onClick={() => {
            recordUserAction('cart_clear', { items: count })
            clearCart()
          }}
        >
          Temizle
        </Button>
      </div>
    </div>
  )
}
