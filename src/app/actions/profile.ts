"use server"

import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database.types'
import { sanitizeInput } from '@/lib/utils'
import { profileSchema } from '@/lib/validations'
import type { z } from 'zod'

export type ProfileInput = z.infer<typeof profileSchema>

export async function updateProfileAction(input: ProfileInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { ok: false, error: 'Unauthorized' }
  }

  const parsed = profileSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.flatten() }
  }

  const clean = {
    username: sanitizeInput(parsed.data.username),
    full_name: sanitizeInput(parsed.data.full_name),
    website: parsed.data.website ?? null,
    location: parsed.data.location ? sanitizeInput(parsed.data.location) : null,
    bio: parsed.data.bio ? sanitizeInput(parsed.data.bio) : null,
    avatar_url: parsed.data.avatar_url ?? null,
  } as Database['public']['Tables']['profiles']['Update']

  // Tip çıkarımındaki anomali nedeniyle tablo adı generic olarak 'any' kabul ettiriliyor
  const { error } = await (supabase as unknown as { from: (t: string) => any })
    .from('profiles')
    .update(clean)
    .eq('id', user.id)

  if (error) {
    return { ok: false, error: error.message }
  }
  return { ok: true }
}


