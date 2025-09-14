import { describe, it, expect } from 'vitest'
import { isNonEmptyString, sanitizeHtml, profileSchema } from '../validations'

describe('Validation Functions', () => {
  describe('isNonEmptyString', () => {
    it('returns true for non-empty strings', () => {
      expect(isNonEmptyString('hello')).toBe(true)
      expect(isNonEmptyString('  hello  ')).toBe(true)
    })

    it('returns false for empty or whitespace strings', () => {
      expect(isNonEmptyString('')).toBe(false)
      expect(isNonEmptyString('   ')).toBe(false)
      expect(isNonEmptyString('\t\n')).toBe(false)
    })

    it('returns false for non-string values', () => {
      expect(isNonEmptyString(null)).toBe(false)
      expect(isNonEmptyString(undefined)).toBe(false)
      expect(isNonEmptyString(123)).toBe(false)
      expect(isNonEmptyString({})).toBe(false)
    })
  })

  describe('sanitizeHtml', () => {
    it('removes script tags', () => {
      const malicious = 'Hello <script>alert("xss")</script> World'
      expect(sanitizeHtml(malicious)).toBe('Hello  World')
    })

    it('removes style tags', () => {
      const malicious = 'Hello <style>body{display:none}</style> World'
      expect(sanitizeHtml(malicious)).toBe('Hello  World')
    })

    it('removes event handlers', () => {
      const malicious = '<div onclick="alert(1)" onload="hack()">Content</div>'
      expect(sanitizeHtml(malicious)).toBe('<div>Content</div>')
    })

    it('removes javascript: URLs', () => {
      const malicious = '<a href="javascript:alert(1)">Link</a>'
      expect(sanitizeHtml(malicious)).toBe('<a href="alert(1)">Link</a>')
    })

    it('preserves safe HTML', () => {
      const safe = '<p>Safe <em>content</em> with <a href="https://example.com">links</a></p>'
      expect(sanitizeHtml(safe)).toBe(safe)
    })
  })

  describe('profileSchema', () => {
    it('validates correct profile data', () => {
      const validProfile = {
        username: 'john_doe',
        full_name: 'John Doe',
        website: 'https://johndoe.com',
        location: 'Istanbul, Turkey',
        bio: 'Software developer',
        avatar_url: 'https://example.com/avatar.jpg'
      }
      
      expect(() => profileSchema.parse(validProfile)).not.toThrow()
    })

    it('requires minimum username length', () => {
      const invalidProfile = {
        username: 'ab', // Too short
        full_name: 'John Doe'
      }
      
      expect(() => profileSchema.parse(invalidProfile)).toThrow()
    })

    it('validates website URL format', () => {
      const invalidProfile = {
        username: 'john_doe',
        full_name: 'John Doe',
        website: 'not-a-url'
      }
      
      expect(() => profileSchema.parse(invalidProfile)).toThrow()
    })

    it('allows optional fields to be undefined', () => {
      const minimalProfile = {
        username: 'john_doe',
        full_name: 'John Doe'
      }
      
      expect(() => profileSchema.parse(minimalProfile)).not.toThrow()
    })

    it('transforms empty website string to undefined', () => {
      const profileWithEmptyWebsite = {
        username: 'john_doe',
        full_name: 'John Doe',
        website: ''
      }
      
      const result = profileSchema.parse(profileWithEmptyWebsite)
      expect(result.website).toBeUndefined()
    })
  })
})