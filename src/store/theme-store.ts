'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeState {
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => {
        set({ theme })
        
        if (typeof window !== 'undefined') {
          const root = document.documentElement
          
          if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
              ? 'dark'
              : 'light'
            root.classList.toggle('dark', systemTheme === 'dark')
          } else {
            root.classList.toggle('dark', theme === 'dark')
          }
        }
      },
    }),
    {
      name: 'velora-theme',
    }
  )
)
