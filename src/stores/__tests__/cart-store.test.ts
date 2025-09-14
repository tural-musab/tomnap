import { describe, it, expect, beforeEach, vi } from 'vitest'

// Unmock the store for this test file
vi.unmock('@/stores/cart-store')
import { useCartStore } from '../cart-store'

// Test helper to reset store
const resetStore = () => {
  useCartStore.getState().items.length = 0
  useCartStore.setState({ items: [] })
}

describe('CartStore', () => {
  beforeEach(() => {
    resetStore()
  })

  describe('addItem', () => {
    it('adds new item to empty cart', () => {
      const { addItem, items } = useCartStore.getState()
      
      const testItem = {
        product_id: '1',
        vendor_id: 'vendor1',
        title: 'Test Product',
        price: 100,
        quantity: 1,
        image_url: 'test.jpg'
      }
      
      addItem(testItem)
      
      const newItems = useCartStore.getState().items
      expect(newItems).toHaveLength(1)
      expect(newItems[0]).toMatchObject(testItem)
    })

    it('increases quantity for existing item', () => {
      const { addItem } = useCartStore.getState()
      
      const testItem = {
        product_id: '1',
        vendor_id: 'vendor1',
        title: 'Test Product',
        price: 100,
        quantity: 1,
        image_url: 'test.jpg'
      }
      
      addItem(testItem)
      addItem(testItem)
      
      const items = useCartStore.getState().items
      expect(items).toHaveLength(1)
      expect(items[0].quantity).toBe(2)
    })

    it('adds different products as separate items', () => {
      const { addItem } = useCartStore.getState()
      
      const item1 = {
        product_id: '1',
        vendor_id: 'vendor1',
        title: 'Product 1',
        price: 100,
        quantity: 1,
        image_url: 'test1.jpg'
      }
      
      const item2 = {
        product_id: '2',
        vendor_id: 'vendor1',
        title: 'Product 2',
        price: 200,
        quantity: 1,
        image_url: 'test2.jpg'
      }
      
      addItem(item1)
      addItem(item2)
      
      const items = useCartStore.getState().items
      expect(items).toHaveLength(2)
    })
  })

  describe('removeItem', () => {
    it('removes item from cart', () => {
      const { addItem, removeItem } = useCartStore.getState()
      
      const testItem = {
        product_id: '1',
        vendor_id: 'vendor1',
        title: 'Test Product',
        price: 100,
        quantity: 1,
        image_url: 'test.jpg'
      }
      
      addItem(testItem)
      expect(useCartStore.getState().items).toHaveLength(1)
      
      removeItem('1')
      expect(useCartStore.getState().items).toHaveLength(0)
    })

    it('does nothing when removing non-existent item', () => {
      const { removeItem } = useCartStore.getState()
      
      expect(() => removeItem('non-existent')).not.toThrow()
      expect(useCartStore.getState().items).toHaveLength(0)
    })
  })

  describe('updateQuantity', () => {
    it('updates item quantity', () => {
      const { addItem, updateQuantity } = useCartStore.getState()
      
      const testItem = {
        product_id: '1',
        vendor_id: 'vendor1',
        title: 'Test Product',
        price: 100,
        quantity: 1,
        image_url: 'test.jpg'
      }
      
      addItem(testItem)
      updateQuantity('1', 5)
      
      const items = useCartStore.getState().items
      expect(items[0].quantity).toBe(5)
    })

    it('removes item when quantity is 0', () => {
      const { addItem, updateQuantity } = useCartStore.getState()
      
      const testItem = {
        product_id: '1',
        vendor_id: 'vendor1',
        title: 'Test Product',
        price: 100,
        quantity: 1,
        image_url: 'test.jpg'
      }
      
      addItem(testItem)
      updateQuantity('1', 0)
      
      expect(useCartStore.getState().items).toHaveLength(0)
    })
  })

  describe('clearCart', () => {
    it('removes all items from cart', () => {
      const { addItem, clearCart } = useCartStore.getState()
      
      const testItems = [
        {
          product_id: '1',
          vendor_id: 'vendor1',
          title: 'Product 1',
          price: 100,
          quantity: 1,
          image_url: 'test1.jpg'
        },
        {
          product_id: '2',
          vendor_id: 'vendor1',
          title: 'Product 2',
          price: 200,
          quantity: 1,
          image_url: 'test2.jpg'
        }
      ]
      
      testItems.forEach(addItem)
      expect(useCartStore.getState().items).toHaveLength(2)
      
      clearCart()
      expect(useCartStore.getState().items).toHaveLength(0)
    })
  })

  describe('computed values', () => {
    beforeEach(() => {
      const { addItem } = useCartStore.getState()
      
      // Add test items
      addItem({
        product_id: '1',
        vendor_id: 'vendor1',
        title: 'Product 1',
        price: 100,
        sale_price: 80,
        quantity: 2,
        image_url: 'test1.jpg'
      })
      
      addItem({
        product_id: '2',
        vendor_id: 'vendor1',
        title: 'Product 2',
        price: 200,
        quantity: 1,
        image_url: 'test2.jpg'
      })
    })

    it('calculates total items correctly', () => {
      const { totalItems } = useCartStore.getState()
      expect(totalItems()).toBe(3) // 2 + 1
    })

    it('calculates total price with sale prices', () => {
      const { totalPrice } = useCartStore.getState()
      expect(totalPrice()).toBe(360) // (80 * 2) + (200 * 1)
    })
  })
})