import { create } from 'zustand'

interface UserState {
  id: string
  username: string
}

interface StoreState {
  user: UserState | null
  setUser: (user: UserState | null) => void
}

export const useUserStore = create<StoreState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))
