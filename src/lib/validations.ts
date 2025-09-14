export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

// Basit HTML temizleyici: script/style/event handler kaldırır
export function sanitizeHtml(input: string): string {
  const withoutScripts = input
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
  // on* event handler ve javascript: URL'leri kaldır
  return withoutScripts
    .replace(/ on[a-z]+="[^"]*"/gi, '')
    .replace(/ on[a-z]+='[^']*'/gi, '')
    .replace(/javascript:/gi, '')
}

// Zod şemaları
import { z } from 'zod'

export const profileSchema = z.object({
  username: z.string().min(3).max(32),
  full_name: z.string().min(2).max(80),
  website: z.string().url().optional().or(z.literal('').transform(() => undefined)),
  location: z.string().max(80).optional(),
  bio: z.string().max(300).optional(),
  avatar_url: z.string().url().optional(),
})
