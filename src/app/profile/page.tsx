'use client'

import { User, Phone, Calendar, Settings, LogOut } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { useAuthStore } from '@/store/auth-store'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-md">
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-6">
              <User className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Tizimga kiring
            </h2>
            <p className="text-gray-500 mb-6">
              Profilingizni ko'rish uchun tizimga kiring
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/login">
                <Button variant="outline" className="rounded-xl">
                  Kirish
                </Button>
              </Link>
              <Link href="/register">
                <Button className="rounded-xl">
                  Ro'yxatdan o'tish
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <Avatar 
            src={user?.avatar} 
            fallback={user?.name?.charAt(0) || 'U'} 
            size="lg"
            className="mx-auto mb-4 w-24 h-24"
          />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {user?.name || 'Foydalanuvchi'}
          </h1>
          <p className="text-gray-500">{user?.phone}</p>
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Shaxsiy ma'lumotlar
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <User className="h-5 w-5" />
                  <span>{user?.name || 'Ism kiritilmagan'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <Phone className="h-5 w-5" />
                  <span>{user?.phone}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Tezkor havolalar
              </h3>
              <div className="space-y-2">
                <Link href="/appointments" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <Calendar className="h-5 w-5 text-rose-500" />
                  <span className="text-gray-700 dark:text-gray-300">Navbatlarim</span>
                </Link>
                <Link href="/services" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <Settings className="h-5 w-5 text-rose-500" />
                  <span className="text-gray-700 dark:text-gray-300">Xizmatlar</span>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Button 
            variant="outline" 
            className="w-full rounded-xl text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Chiqish
          </Button>
        </div>
      </div>
    </div>
  )
}
