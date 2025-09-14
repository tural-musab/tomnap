import { describe, it, expect } from 'vitest'
import { cn, formatPrice, formatNumber, sanitizeInput } from '../utils'

describe('Utils Functions', () => {
  describe('cn (className utility)', () => {
    it('merges class names correctly', () => {
      expect(cn('px-2 py-1', 'bg-red-500')).toContain('px-2')
      expect(cn('px-2 py-1', 'bg-red-500')).toContain('py-1') 
      expect(cn('px-2 py-1', 'bg-red-500')).toContain('bg-red-500')
    })

    it('handles conflicting classes with Tailwind merge', () => {
      const result = cn('px-2 px-4')
      expect(result).toBe('px-4')
    })

    it('handles conditional classes', () => {
      expect(cn('base', false && 'conditional')).toBe('base')
      expect(cn('base', true && 'conditional')).toBe('base conditional')
    })
  })

  describe('formatPrice', () => {
    it('formats Turkish Lira by default', () => {
      expect(formatPrice(1000)).toBe('₺1.000,00')
      expect(formatPrice(1500.50)).toBe('₺1.500,50')
    })

    it('handles different currencies', () => {
      expect(formatPrice(1000, 'USD')).toBe('$1.000,00')
    })

    it('handles zero and negative values', () => {
      expect(formatPrice(0)).toBe('₺0,00')
      expect(formatPrice(-100)).toBe('-₺100,00')
    })
  })

  describe('formatNumber', () => {
    it('formats large numbers with K suffix', () => {
      expect(formatNumber(1500)).toBe('1.5K')
      expect(formatNumber(10000)).toBe('10.0K')
      expect(formatNumber(999)).toBe('999')
    })

    it('formats millions with M suffix', () => {
      expect(formatNumber(1500000)).toBe('1.5M')
      expect(formatNumber(2000000)).toBe('2.0M')
    })

    it('handles small numbers without suffix', () => {
      expect(formatNumber(100)).toBe('100')
      expect(formatNumber(0)).toBe('0')
    })
  })

  describe('sanitizeInput', () => {
    it('removes script tags', () => {
      const maliciousInput = 'Hello <script>alert("xss")</script> World'
      expect(sanitizeInput(maliciousInput)).toBe('Hello  World')
    })

    it('removes event handlers', () => {
      const maliciousInput = '<div onclick="alert(1)">Click me</div>'
      expect(sanitizeInput(maliciousInput)).toBe('<div>Click me</div>')
    })

    it('removes javascript protocols', () => {
      const maliciousInput = '<a href="javascript:alert(1)">Link</a>'
      expect(sanitizeInput(maliciousInput)).toBe('<a href="alert(1)">Link</a>')
    })

    it('preserves safe HTML', () => {
      const safeInput = '<p>Safe <strong>content</strong></p>'
      expect(sanitizeInput(safeInput)).toBe(safeInput)
    })
  })
})