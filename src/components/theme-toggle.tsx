'use client'

import { Moon, Sun } from 'lucide-react'
import { useThemeStore } from '@/store/theme-store'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore()
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check actual dark class on document
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    
    checkDark()
    
    // Watch for class changes
    const observer = new MutationObserver(checkDark)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    
    return () => observer.disconnect()
  }, [theme])

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark'
    setTheme(newTheme)
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative h-10 w-10 rounded-xl transition-all duration-500 ease-out',
        'flex items-center justify-center overflow-hidden',
        'hover:scale-110 active:scale-95',
        // Light mode - Warm golden gradient
        !isDark && [
          'bg-gradient-to-br from-amber-400 via-accent to-accent-dark',
          'shadow-lg shadow-accent/40',
          'hover:shadow-xl hover:shadow-accent/60',
          'ring-2 ring-white/30',
        ],
        // Dark mode - Deep luxurious gradient
        isDark && [
          'bg-gradient-to-br from-slate-800 via-slate-900 to-black',
          'shadow-lg shadow-accent/30',
          'hover:shadow-xl hover:shadow-accent/50',
          'ring-2 ring-accent/30',
        ]
      )}
      title={isDark ? 'Yorug\' rejim' : 'Qorong\'i rejim'}
    >
      {/* Stars for dark mode */}
      {isDark && (
        <>
          <span className="absolute top-1.5 right-2 w-1 h-1 bg-accent rounded-full animate-pulse" />
          <span className="absolute top-3 right-1.5 w-0.5 h-0.5 bg-accent/80 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
          <span className="absolute bottom-2 left-2 w-0.5 h-0.5 bg-accent/60 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />
        </>
      )}

      {/* Sun icon */}
      <Sun className={cn(
        'h-5 w-5 transition-all duration-500 absolute',
        !isDark 
          ? 'opacity-100 rotate-0 scale-100 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' 
          : 'opacity-0 rotate-180 scale-0 text-accent'
      )} />

      {/* Moon icon */}
      <Moon className={cn(
        'h-5 w-5 transition-all duration-500 absolute',
        isDark 
          ? 'opacity-100 rotate-0 scale-100 text-accent drop-shadow-[0_0_8px_rgba(197,163,88,0.5)]' 
          : 'opacity-0 -rotate-180 scale-0 text-accent'
      )} />
    </button>
  )
}
