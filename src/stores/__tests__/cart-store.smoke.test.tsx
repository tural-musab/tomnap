import React from 'react'
import { describe, it, expect } from 'vitest'
import { useCartStore } from '@/stores/cart-store'

describe('cart-store', () => {
  it('adds item and updates totals', async () => {
    const add = useCartStore.getState().addItem
    await add({ id: 'p1', title: 'Prod', price: 10, vendor_id: 'v1', vendor: null, images: [] }, 2)
    const totalItems = useCartStore.getState().totalItems()
    const totalPrice = useCartStore.getState().totalPrice()
    expect(totalItems).toBeGreaterThan(0)
    expect(totalPrice).toBeGreaterThan(0)
  })
})


