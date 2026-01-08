'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, Clock, Users, Star, TrendingUp, 
  CheckCircle, XCircle, DollarSign, Bell
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { RoleGuard } from '@/components/auth/role-guard'
import { useAuthStore } from '@/store/auth-store'
import { cn } from '@/lib/utils'

const todayAppointments = [
  { id: 1, client: 'Malika K.', service: 'Soch kesish', time: '10:00', status: 'confirmed', price: 80000 },
  { id: 2, client: 'Nilufar S.', service: 'Soch bo\'yash', time: '11:30', status: 'pending', price: 250000 },
  { id: 3, client: 'Zarina A.', service: 'Ukladka', time: '14:00', status: 'confirmed', price: 100000 },
  { id: 4, client: 'Dilnoza M.', service: 'Soch davolash', time: '16:00', status: 'pending', price: 150000 },
]

const stats = [
  { label: 'Bugungi navbatlar', value: '4', icon: Calendar, color: 'bg-blue-500' },
  { label: 'Bugungi daromad', value: '580,000', icon: DollarSign, color: 'bg-emerald-500' },
  { label: 'Jami mijozlar', value: '128', icon: Users, color: 'bg-purple-500' },
  { label: 'O\'rtacha reyting', value: '4.9', icon: Star, color: 'bg-amber-500' },
]

function MasterDashboard() {
  const { user } = useAuthStore()
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed'>('all')

  const filteredAppointments = todayAppointments.filter(apt => 
    filter === 'all' ? true : apt.status === filter
  )

  return (
    <div className="min-h-screen bg-section py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-gray-800 dark:text-white mb-2">
            Salom, {user?.name || 'Stilist'}! 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Bugungi jadvalingiz va statistikangiz</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-0 shadow-luxury">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", stat.color)}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Today's Appointments */}
        <Card className="border-0 shadow-luxury mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl text-gray-800 dark:text-white">Bugungi navbatlar</h2>
              <div className="flex gap-2">
                {(['all', 'pending', 'confirmed'] as const).map((f) => (
                  <Button
                    key={f}
                    variant={filter === f ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(f)}
                  >
                    {f === 'all' ? 'Barchasi' : f === 'pending' ? 'Kutilmoqda' : 'Tasdiqlangan'}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {filteredAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-4 bg-section rounded-lg">
                  <div className="flex items-center gap-4">
                    <Avatar fallback={apt.client.charAt(0)} />
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">{apt.client}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{apt.service}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium text-gray-800 dark:text-white">{apt.time}</p>
                      <p className="text-sm text-accent">{apt.price.toLocaleString()} so'm</p>
                    </div>
                    <Badge className={cn(
                      apt.status === 'confirmed' ? 'bg-emerald-500' : 'bg-amber-500',
                      'text-white border-0'
                    )}>
                      {apt.status === 'confirmed' ? 'Tasdiqlangan' : 'Kutilmoqda'}
                    </Badge>
                    {apt.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" className="text-emerald-500 hover:bg-emerald-50">
                          <CheckCircle className="h-5 w-5" />
                        </Button>
                        <Button size="icon" variant="ghost" className="text-red-500 hover:bg-red-50">
                          <XCircle className="h-5 w-5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-luxury hover-elevation cursor-pointer">
            <CardContent className="p-6 text-center">
              <Calendar className="h-10 w-10 text-accent mx-auto mb-4" />
              <h3 className="font-serif text-lg text-gray-800 dark:text-white mb-2">Jadval boshqarish</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Ish vaqtlaringizni sozlang</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-luxury hover-elevation cursor-pointer">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-10 w-10 text-accent mx-auto mb-4" />
              <h3 className="font-serif text-lg text-gray-800 dark:text-white mb-2">Daromad hisoboti</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Oylik statistikani ko'ring</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-luxury hover-elevation cursor-pointer">
            <CardContent className="p-6 text-center">
              <Bell className="h-10 w-10 text-accent mx-auto mb-4" />
              <h3 className="font-serif text-lg text-gray-800 dark:text-white mb-2">Bildirishnomalar</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">3 ta yangi xabar</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function MasterPage() {
  return (
    <RoleGuard allowedRoles={['MASTER']}>
      <MasterDashboard />
    </RoleGuard>
  )
}
