import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCart } from '../use-cart'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('useCart Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  it('initializes with empty items', () => {
    const { result } = renderHook(() => useCart())
    expect(result.current.items).toEqual([])
  })

  it('loads items from localStorage on init', () => {
    const storedItems = [{ id: '1', qty: 2 }]
    localStorageMock.getItem.mockReturnValue(JSON.stringify(storedItems))
    
    const { result } = renderHook(() => useCart())
    expect(result.current.items).toEqual(storedItems)
  })

  it('adds new item to cart', () => {
    const { result } = renderHook(() => useCart())
    
    act(() => {
      result.current.addItem('product-1', 2)
    })
    
    expect(result.current.items).toEqual([{ id: 'product-1', qty: 2 }])
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'cart',
      JSON.stringify([{ id: 'product-1', qty: 2 }])
    )
  })

  it('increases quantity for existing item', () => {
    const { result } = renderHook(() => useCart())
    
    act(() => {
      result.current.addItem('product-1', 1)
    })
    
    act(() => {
      result.current.addItem('product-1', 2)
    })
    
    expect(result.current.items).toEqual([{ id: 'product-1', qty: 3 }])
  })

  it('removes item from cart', () => {
    const { result } = renderHook(() => useCart())
    
    act(() => {
      result.current.addItem('product-1', 1)
      result.current.addItem('product-2', 1)
    })
    
    act(() => {
      result.current.removeItem('product-1')
    })
    
    expect(result.current.items).toEqual([{ id: 'product-2', qty: 1 }])
  })

  it('clears all items', () => {
    const { result } = renderHook(() => useCart())
    
    act(() => {
      result.current.addItem('product-1', 1)
      result.current.addItem('product-2', 1)
    })
    
    act(() => {
      result.current.clear()
    })
    
    expect(result.current.items).toEqual([])
    expect(localStorageMock.setItem).toHaveBeenLastCalledWith('cart', '[]')
  })
})