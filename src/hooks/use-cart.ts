import { useEffect, useState } from 'react'

export function useCart() {
  const [items, setItems] = useState<Array<{ id: string; qty: number }>>([])

  useEffect(() => {
    // placeholder persistence
    const stored = typeof window !== 'undefined' ? localStorage.getItem('cart') : null
    if (stored) setItems(JSON.parse(stored))
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(items))
    }
  }, [items])

  function addItem(id: string, qty = 1) {
    setItems((prev) => {
      const existing = prev.find((it) => it.id === id)
      if (existing) {
        return prev.map((it) => (it.id === id ? { ...it, qty: it.qty + qty } : it))
      }
      return [...prev, { id, qty }]
    })
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id))
  }

  function clear() {
    setItems([])
  }

  return { items, addItem, removeItem, clear }
}
