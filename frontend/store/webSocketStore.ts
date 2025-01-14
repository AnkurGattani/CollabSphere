// create a store to store socket connection and user data
import { create } from 'zustand'
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware'

interface socketState {
  socketUrl: string | null
  setSocketUrl: (url: string) => void
}

export const useSocketStore = create<socketState>()(
  persist<socketState>(
    (set) => ({
      socketUrl: null,
      setSocketUrl: (url) => set({ socketUrl: url }),
    }),
    {
      name: 'socket-storage', // unique name for localStorage key
      storage: typeof window !== 'undefined' ? createJSONStorage(() => localStorage) : undefined
    } as PersistOptions<socketState>
  )
)
