import { create } from 'zustand'
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware'

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
}

interface AuthState {
  isLogin: boolean
  token: string | null
  user: User | null
  setIsLogin: (isLogin: boolean) => void
  setToken: (token: string | null) => void
  setUser: (user: User | null) => void
}

export const useAuthStore = create<AuthState>()(
  persist<AuthState>(
    (set) => ({
      isLogin: false,
      token: null,
      user: null,
      setIsLogin: (isLogin) => set({ isLogin }),
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage', // unique name for localStorage key
      storage: typeof window !== 'undefined' ? createJSONStorage(() => localStorage) : undefined
    } as PersistOptions<AuthState>
  )
)