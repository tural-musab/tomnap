'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useCartStore } from '@/stores/cart-store'

interface ProductBrief {
  id: string
  title: string
  price?: number | null
  description?: string | null
}

interface ProductSheetProps {
  product: ProductBrief | null
  open: boolean
  onClose: () => void
}

export default function ProductSheet({ product, open, onClose }: ProductSheetProps) {
  const supabase = createClient()
  const addToCart = useCartStore((s) => s.addItem)

  const handleAdd = async () => {
    if (!product) return
    // Fetch product details for price/vendor to ensure accuracy
    const { data } = await supabase
      .from('products')
      .select('id, title, price, sale_price, images, vendor_id, vendor:profiles(username)')
      .eq('id', product.id)
      .single()
    if (data) {
      await addToCart(data, 1)
      onClose()
    }
  }
  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="bottom" className="h-[75vh]">
        <SheetHeader>
          <SheetTitle>{product?.title ?? 'Ürün'}</SheetTitle>
        </SheetHeader>
        <div className="mt-4 flex flex-col gap-4">
          <div className="h-40 w-full rounded-md bg-muted" />
          <div className="flex items-center justify-between">
            <div className="text-xl font-semibold">{formatPrice(product?.price ?? 0)}</div>
            <Button onClick={handleAdd}>Sepete Ekle</Button>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-4">{product?.description}</p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
