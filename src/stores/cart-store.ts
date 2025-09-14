import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { Database } from '@/types/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'

interface CartItem {
  id: string
  product_id: string
  title: string
  price: number
  sale_price?: number
  image: string
  quantity: number
  variant?: Record<string, unknown>
  vendor_id: string
  vendor_name: string
}

interface CartStore {
  items: CartItem[]
  isLoading: boolean
  isOpen: boolean

  // Actions
  addItem: (
    product: {
      id: string
      title: string
      price: number
      sale_price?: number | null
      images?: Array<{ url?: string }>
      vendor_id: string
      vendor?: { username?: string } | null
    },
    quantity?: number
  ) => Promise<void>
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  setOpen: (open: boolean) => void

  // Computed
  totalItems: () => number
  totalPrice: () => number
  syncWithDatabase: () => Promise<void>
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      isOpen: false,

      addItem: async (product, quantity = 1) => {
        set({ isLoading: true })

        const existingItem = get().items.find((item) => item.product_id === product.id)

        if (existingItem) {
          set((state) => ({
            items: state.items.map((item) =>
              item.product_id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
            isLoading: false,
          }))
          toast.success(`${product.title} sepete eklendi`)
        } else {
          const newItem: CartItem = {
            id: crypto.randomUUID(),
            product_id: product.id,
            title: product.title,
            price: product.price,
            sale_price: product.sale_price ?? undefined,
            image: product.images?.[0]?.url || '',
            quantity,
            vendor_id: product.vendor_id,
            vendor_name: product.vendor?.username || '',
          }

          set((state) => ({
            items: [...state.items, newItem],
            isLoading: false,
          }))
          toast.success(`${product.title} sepete eklendi`)
        }

        // Sync with database if user is logged in
        const supabase = createClient() as SupabaseClient<Database>
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          await get().syncWithDatabase()
        }
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product_id !== productId),
        }))
        toast.info('Ürün sepetten çıkarıldı')
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product_id === productId ? { ...item, quantity } : item
          ),
        }))
      },

      clearCart: () => {
        set({ items: [] })
        toast.info('Sepet temizlendi')
      },

      setOpen: (open) => set({ isOpen: open }),

      totalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },

      totalPrice: () => {
        return get().items.reduce((sum, item) => {
          const price = item.sale_price || item.price
          return sum + price * item.quantity
        }, 0)
      },

      syncWithDatabase: async () => {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) return

        const items = get().items

        // Clear existing cart items
        await supabase.from('cart_items').delete().eq('user_id', user.id)

        // Insert new cart items
        if (items.length > 0) {
          const cartItems: Database['public']['Tables']['cart_items']['Insert'][] = items.map(
            (item) => ({
              user_id: user.id,
              product_id: item.product_id,
              quantity: item.quantity,
              variant: (item.variant ?? null) as Database['public']['Tables']['cart_items']['Insert']['variant'],
            })
          )

          await supabase.from('cart_items').insert(cartItems as Database['public']['Tables']['cart_items']['Insert'][])
        }
      },
    }),
    {
      name: 'tomnap-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
)
