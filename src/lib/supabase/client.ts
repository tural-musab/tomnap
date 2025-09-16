import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

// In build/prerender environments without envs, avoid throwing by creating a dummy client
function createFallbackClient(): SupabaseClient<any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return {
    auth: {
      // minimal no-op methods used in code paths
      getUser: async () => ({ data: { user: null }, error: null } as any),
      signOut: async () => ({ error: null } as any),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } } as any),
    },
    from() {
      return {
        select: () => ({ data: null, error: null } as any),
        update: () => ({ data: null, error: null } as any),
        insert: () => ({ data: null, error: null } as any),
        delete: () => ({ data: null, error: null } as any),
        eq: () => ({ data: null, error: null } as any),
        single: () => ({ data: null, error: null } as any),
      } as any
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any
}

export function createClient(): SupabaseClient<Database> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    return createFallbackClient() as unknown as SupabaseClient<Database>
  }
  return createBrowserClient<Database>(url, key)
}
