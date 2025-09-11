import { create } from 'zustand'

interface Video {
  id: string
  title: string
}

interface VideoStoreState {
  videos: Video[]
  append: (list: Video[]) => void
  reset: () => void
}

export const useVideoStore = create<VideoStoreState>((set) => ({
  videos: [],
  append: (list) => set((state) => ({ videos: [...state.videos, ...list] })),
  reset: () => set({ videos: [] }),
}))
