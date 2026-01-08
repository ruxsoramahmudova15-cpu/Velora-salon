'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Scissors,
  Calendar,
  DollarSign,
  Crown,
  Star,
  Clock,
  ArrowUpRight,
  Activity
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Loading } from '@/components/ui/loading'
import { cn } from '@/lib/utils'

interface DashboardStats {
  todayRevenue: number
  weeklyRevenue: number
  monthlyRevenue: number
  totalClients: number
  newClientsToday: number
  newClientsThisWeek: number
  activeMasters: number
  todayAppointments: number
  trends: {
    revenue: 'up' | 'down' | 'stable'
    clients: 'up' | 'down' | 'stable'
    appointments: 'up' | 'down' | 'stable'
  }
}

interface Activity {
  id: string
  type: string
  message: string
  timestamp: string
}

interface TopService {
  name: string
  count: number
  revenue: number
}

interface TopMaster {
  name: string
  rating: number
  appointments: number
  revenue: number
}

// Animated counter component
function AnimatedCounter({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * value))
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [value, duration])

  return <>{count.toLocaleString()}</>
}

const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
  if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />
  if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />
  return <Minus className="w-4 h-4 text-gray-400" />
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [topServices, setTopServices] = useState<TopService[]>([])
  const [topMasters, setTopMasters] = useState<TopMaster[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard')
      const data = await response.json()
      setStats(data.stats)
      setActivities(data.recentActivity || [])
      setTopServices(data.topServices || [])
      setTopMasters(data.topMasters || [])
    } catch (error) {
      console.error('Error fetching dashboard:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return (price / 1000000).toFixed(1) + 'M'
    }
    if (price >= 1000) {
      return (price / 1000).toFixed(0) + 'K'
    }
    return price.toString()
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loading size="lg" />
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Today Revenue */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <TrendIcon trend={stats?.trends.revenue || 'stable'} />
              </div>
              <p className="text-sm text-gray-500 mb-1">Bugungi daromad</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                <AnimatedCounter value={stats?.todayRevenue || 0} /> so'm
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Monthly Revenue */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <Badge variant="success">+12%</Badge>
              </div>
              <p className="text-sm text-gray-500 mb-1">Oylik daromad</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                <AnimatedCounter value={stats?.monthlyRevenue || 0} /> so'm
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Total Clients */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <TrendIcon trend={stats?.trends.clients || 'stable'} />
              </div>
              <p className="text-sm text-gray-500 mb-1">Jami mijozlar</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                <AnimatedCounter value={stats?.totalClients || 0} />
              </p>
              <p className="text-xs text-green-500 mt-1">
                +{stats?.newClientsThisWeek || 0} bu hafta
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Today Appointments */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <TrendIcon trend={stats?.trends.appointments || 'stable'} />
              </div>
              <p className="text-sm text-gray-500 mb-1">Bugungi navbatlar</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                <AnimatedCounter value={stats?.todayAppointments || 0} />
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts & Lists */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top Services */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-rose-500" />
                Top Xizmatlar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topServices.map((service, idx) => (
                  <div key={service.name} className="flex items-center gap-4">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm",
                      idx === 0 ? "bg-yellow-500" : idx === 1 ? "bg-gray-400" : idx === 2 ? "bg-amber-600" : "bg-gray-300"
                    )}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {service.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {service.count} bron
                      </p>
                    </div>
                    <p className="font-semibold text-rose-500">
                      {formatPrice(service.revenue)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Masters */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scissors className="w-5 h-5 text-rose-500" />
                Top Stilistlar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topMasters.map((master, idx) => (
                  <div key={master.name} className="flex items-center gap-4">
                    <Avatar fallback={master.name.charAt(0)} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {master.name}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        {master.rating}
                        <span>•</span>
                        {master.appointments} navbat
                      </div>
                    </div>
                    <p className="font-semibold text-rose-500">
                      {formatPrice(master.revenue)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-rose-500" />
                So'nggi faoliyat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.length > 0 ? (
                  activities.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                        activity.type === 'BOOKING' ? "bg-green-100 text-green-600" :
                        activity.type === 'CANCELLATION' ? "bg-red-100 text-red-600" :
                        activity.type === 'REGISTRATION' ? "bg-blue-100 text-blue-600" :
                        "bg-gray-100 text-gray-600"
                      )}>
                        {activity.type === 'BOOKING' ? <Calendar className="w-4 h-4" /> :
                         activity.type === 'REGISTRATION' ? <Users className="w-4 h-4" /> :
                         <Clock className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white">
                          {activity.message}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleString('uz-UZ')}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    Hozircha faoliyat yo'q
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Stats Row */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mx-auto mb-3">
                  <Scissors className="w-6 h-6 text-rose-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.activeMasters || 0}
                </p>
                <p className="text-sm text-gray-500">Faol stilistlar</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-3">
                  <Crown className="w-6 h-6 text-purple-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  9
                </p>
                <p className="text-sm text-gray-500">Kelin ko'ylaklar</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-amber-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  4.9
                </p>
                <p className="text-sm text-gray-500">O'rtacha reyting</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
                  <ArrowUpRight className="w-6 h-6 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  +{stats?.newClientsToday || 0}
                </p>
                <p className="text-sm text-gray-500">Yangi mijozlar bugun</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
