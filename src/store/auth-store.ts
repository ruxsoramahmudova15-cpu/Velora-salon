'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  _hasHydrated: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setHasHydrated: (state: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      _hasHydrated: false,
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        isLoading: false 
      }),
      setLoading: (isLoading) => set({ isLoading }),
      setHasHydrated: (state) => set({ 
        _hasHydrated: state,
        isLoading: false 
      }),
      logout: () => set({ 
        user: null, 
        isAuthenticated: false,
        isLoading: false 
      }),
    }),
    {
      name: 'velora-auth',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)

export const isClient = (user: User | null): boolean => 
  user?.role === 'CLIENT'

export const isMaster = (user: User | null): boolean => 
  user?.role === 'MASTER'

export const isAdmin = (user: User | null): boolean => 
  user?.role === 'ADMIN'
