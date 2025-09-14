import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CartSummary from '../cart-summary'
import { useCartStore } from '@/stores/cart-store'

// Mock supabase client
vi.mock('@/lib/supabase/client', () => {
  const supabase = {
    auth: {
      getUser: async () => ({ data: { user: { id: 'user-1' } } }),
    },
    from: (table: string) => ({
      insert: (data: unknown) => ({
        select: () => ({
          single: async () => ({ data: table === 'orders' ? { id: 'order-1' } : null, error: null }),
        }),
      }),
      delete: () => ({ eq: () => ({}) }),
      select: () => ({ single: async () => ({ data: null, error: null }) }),
    }),
  }
  return { createClient: () => supabase }
})

// @ts-expect-error injected by vitest.setup
const { customRender: render } = globalThis as unknown as { customRender: typeof import('@testing-library/react').render }

describe('Order split smoke', () => {
  it('clears cart after creating order and order_items', async () => {
    // Seed cart with two vendors
    useCartStore.setState({
      items: [
        {
          id: 'c1',
          product_id: 'p1',
          title: 'Prod 1',
          price: 10,
          image: '',
          quantity: 1,
          vendor_id: 'v1',
          vendor_name: 'Vendor 1',
        },
        {
          id: 'c2',
          product_id: 'p2',
          title: 'Prod 2',
          price: 20,
          image: '',
          quantity: 2,
          vendor_id: 'v2',
          vendor_name: 'Vendor 2',
        },
      ],
    })

    // Silence redirect
    const originalHref = window.location.href
    Object.defineProperty(window, 'location', {
      value: { ...window.location, href: originalHref },
      writable: true,
    })
    const hrefSpy = vi.spyOn(window.location, 'href', 'set').mockImplementation(() => {})
    render(<CartSummary />)

    await userEvent.click(screen.getByRole('button', { name: /Ödemeye Geç/i }))

    await waitFor(() => {
      expect(useCartStore.getState().items.length).toBe(0)
    })

    hrefSpy.mockRestore()
    window.location.href = originalHref
  })
})


