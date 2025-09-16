import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { createClient } from '@/lib/supabase/client'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'
import type { User } from '@supabase/supabase-js'

type Profile = Database['public']['Tables']['profiles']['Row']
type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

interface UserStore {
  user: User | null
  profile: Profile | null
  isLoading: boolean
  
  // Actions
  setUser: (user: User | null) => void
  setProfile: (profile: Profile | null) => void
  fetchProfile: (userId: string) => Promise<void>
  updateProfile: (updates: ProfileUpdate) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      isLoading: false,

      setUser: (user) => set({ user }),
      
      setProfile: (profile) => set({ profile }),

      fetchProfile: async (userId) => {
        set({ isLoading: true })
        const supabase: SupabaseClient<Database> = createClient()
        
        const { data: profile, error } = await supabase
          .schema('public')
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()

        if (!error && profile) {
          set({ profile, isLoading: false })
        } else {
          set({ isLoading: false })
        }
      },

      updateProfile: async (updates) => {
        const { user, profile } = get()
        if (!user || !profile) return

        set({ isLoading: true })
        const supabase: SupabaseClient<Database> = createClient()
        
        const { data: updatedProfile, error } = await supabase
          .schema('public')
          .from('profiles')
          .update(updates)
          .eq('id', user.id)
          .select()
          .single()

        if (!error && updatedProfile) {
          set({ profile: updatedProfile, isLoading: false })
        } else {
          set({ isLoading: false })
        }
      },

      logout: () => {
        set({ user: null, profile: null })
      },

      checkAuth: async () => {
        set({ isLoading: true })
        const supabase: SupabaseClient<Database> = createClient()
        
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          set({ user })
          await get().fetchProfile(user.id)
        } else {
          set({ user: null, profile: null, isLoading: false })
        }
      }
    }),
    {
      name: 'tomnap-user',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user,
        profile: state.profile 
      })
    }
  )
)
