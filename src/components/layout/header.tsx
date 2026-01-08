'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, User, Calendar, LogOut, Sparkles, ChevronDown, Scissors, Shield, LayoutDashboard, MessageCircle } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme-toggle'
import { useAuthStore } from '@/store/auth-store'
import { cn } from '@/lib/utils'

const publicLinks = [
  { href: '/', label: 'Bosh sahifa' },
  { href: '/masters', label: 'Stilistlar' },
  { href: '/dresses', label: 'Ko\'ylak' },
  { href: '/services', label: 'Xizmatlar' },
  { href: '/booking', label: 'Navbat' },
  { href: '/about', label: 'Biz haqimizda' },
]

const getRoleInfo = (role: string) => {
  switch (role) {
    case 'ADMIN':
      return { label: 'Admin', icon: Shield, color: 'bg-red-500', dashboard: '/admin' }
    case 'MASTER':
      return { label: 'Stilist', icon: Scissors, color: 'bg-purple-500', dashboard: '/master' }
    default:
      return { label: 'Mijoz', icon: User, color: 'bg-accent', dashboard: '/profile' }
  }
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuthStore()
  
  const clickCountRef = useRef(0)
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null)

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    clickCountRef.current += 1
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current)
    if (clickCountRef.current >= 2) {
      clickCountRef.current = 0
      router.push('/admin/login')
    } else {
      clickTimerRef.current = setTimeout(() => {
        if (clickCountRef.current === 1) router.push('/')
        clickCountRef.current = 0
      }, 300)
    }
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled 
        ? "header-scrolled" 
        : "header-transparent"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo - Chapda */}
          <a href="/" onClick={handleLogoClick} className="flex items-center gap-2 shrink-0">
            <div className="flex h-10 w-10 items-center justify-center icon-box-accent rounded-xl">
              <span className="font-serif text-lg text-white font-bold">V</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-serif text-xl font-bold text-accent">VELORA</span>
              <p className="text-[9px] -mt-1 light-text-muted">Go'zallik platformasi</p>
            </div>
          </a>

          {/* Desktop Navigation - O'rtada */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap nav-link-text",
                  pathname === link.href
                    ? "text-white bg-gradient-to-r from-[#B8956E] to-[#9A7B5A]"
                    : "hover:bg-light-gray"
                )}
                style={pathname === link.href ? { color: 'white' } : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side - O'ngda */}
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/recommendation" className="hidden md:flex">
              <Button variant="ghost" size="sm" className="gap-1 rounded-full nav-link-text">
                <Sparkles className="h-4 w-4 text-[#B8956E]" />
                <span className="hidden xl:inline text-xs">Mos xizmat</span>
              </Button>
            </Link>

            <ThemeToggle />
            
            {isAuthenticated && user ? (
              <div className="hidden md:flex items-center gap-1">
                {(user.role === 'ADMIN' || user.role === 'MASTER') && (
                  <Link href={getRoleInfo(user.role).dashboard}>
                    <Button variant="ghost" size="sm" className="gap-1 rounded-full nav-link-text">
                      <LayoutDashboard className="h-4 w-4" />
                      <span className="hidden xl:inline text-xs">Dashboard</span>
                    </Button>
                  </Link>
                )}
                <Link href="/chat">
                  <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                    <MessageCircle className="h-4 w-4 light-text-muted" />
                  </Button>
                </Link>
                <Link href="/appointments">
                  <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                    <Calendar className="h-4 w-4 light-text-muted" />
                  </Button>
                </Link>
                <Link href="/profile" className="flex items-center gap-1 px-2 py-1 rounded-full bg-light-gray">
                  <Avatar src={user.avatar} alt={user.name || ''} fallback={user.name?.charAt(0)} size="sm" />
                  <ChevronDown className="h-3 w-3 light-text-muted" />
                </Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="rounded-full text-sm nav-link-text">
                    Kirish
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="rounded-full text-sm">
                    Ro'yxatdan o'tish
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg bg-light-gray"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-accent" />
              ) : (
                <Menu className="h-5 w-5 text-accent" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "lg:hidden absolute top-full left-0 right-0 mobile-menu-bg border-t border-nude shadow-xl transition-all duration-300 overflow-hidden",
        mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <nav className="container mx-auto px-4 py-4 space-y-1">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all nav-link-text",
                                pathname === link.href
                  ? "!text-white bg-gradient-to-r from-[#B8956E] to-[#9A7B5A]"
                  : "hover:bg-light-gray"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          
          <Link
            href="/recommendation"
            className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl"
            style={{ color: '#B8956E', background: 'rgba(184,149,110,0.1)' }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Sparkles className="h-5 w-5" />
            Men uchun mos xizmat
          </Link>

          <hr className="my-3 border-nude" />
          
          {isAuthenticated ? (
            <>
              {user && (user.role === 'ADMIN' || user.role === 'MASTER') && (
                <Link
                  href={getRoleInfo(user.role).dashboard}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl"
                  style={{ color: '#B8956E', background: 'rgba(184,149,110,0.1)' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Dashboard
                </Link>
              )}
              <Link
                href="/chat"
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl hover:bg-light-gray nav-link-text"
                onClick={() => setMobileMenuOpen(false)}
              >
                <MessageCircle className="h-5 w-5" />
                Xabarlar
              </Link>
              <Link
                href="/appointments"
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl hover:bg-light-gray nav-link-text"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Calendar className="h-5 w-5" />
                Navbatlarim
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl hover:bg-light-gray nav-link-text"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="h-5 w-5" />
                Profil
                {user && (
                  <Badge className={cn("ml-auto text-[10px] px-2 py-0.5 text-white border-0", getRoleInfo(user.role).color)}>
                    {getRoleInfo(user.role).label}
                  </Badge>
                )}
              </Link>
              <button
                onClick={() => { logout(); setMobileMenuOpen(false) }}
                className="flex items-center gap-2 w-full px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
              >
                <LogOut className="h-5 w-5" />
                Chiqish
              </button>
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full rounded-xl">Kirish</Button>
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full rounded-xl">Ro'yxatdan o'tish</Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
