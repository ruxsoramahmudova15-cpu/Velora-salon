'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Filter,
  Search,
  Scissors
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface Booking {
  id: string
  date: string
  startTime: string
  endTime: string
  status: string
  finalPrice: number
  originalPrice: number
  discountAmount: number
  serviceName: string
  client: {
    id: string
    name: string
    phone: string
    avatar?: string
  }
  master: {
    id: string
    name: string
    phone: string
    avatar?: string
    specialization: string
  }
  createdAt: string
}

interface Stats {
  total: number
  pending: number
  confirmed: number
  completed: number
  cancelled: number
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  PENDING: { label: 'Kutilmoqda', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
  CONFIRMED: { label: 'Tasdiqlangan', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  COMPLETED: { label: 'Bajarilgan', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  CANCELLED: { label: 'Bekor qilingan', color: 'bg-red-100 text-red-800', icon: XCircle },
  NO_SHOW: { label: 'Kelmadi', color: 'bg-gray-100 text-gray-800', icon: XCircle },
  RESERVED: { label: 'Band qilingan', color: 'bg-purple-100 text-purple-800', icon: Clock }
}

const specializationLabels: Record<string, string> = {
  SOCH: 'Soch',
  TIRNOQ: 'Tirnoq',
  QOSH: 'Qosh',
  MAKIYAJ: 'Makiyaj'
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 })
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchBookings()
  }, [filter, dateFilter])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filter !== 'all') params.append('status', filter)
      if (dateFilter) params.append('date', dateFilter)
      
      const res = await fetch(`/api/admin/bookings?${params}`)
      const data = await res.json()
      
      if (data.success) {
        setBookings(data.data)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      })
      
      if (res.ok) {
        fetchBookings()
      }
    } catch (error) {
      console.error('Update error:', error)
    }
  }

  const filteredBookings = bookings.filter(booking => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      booking.client.name?.toLowerCase().includes(query) ||
      booking.client.phone.includes(query) ||
      booking.master.name?.toLowerCase().includes(query) ||
      booking.serviceName.toLowerCase().includes(query)
    )
  })

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('uz-UZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m'
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
          <p className="text-sm text-gray-500">Jami</p>
        </Card>
        <Card className="p-4 text-center border-l-4 border-yellow-500">
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-sm text-gray-500">Kutilmoqda</p>
        </Card>
        <Card className="p-4 text-center border-l-4 border-blue-500">
          <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
          <p className="text-sm text-gray-500">Tasdiqlangan</p>
        </Card>
        <Card className="p-4 text-center border-l-4 border-green-500">
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          <p className="text-sm text-gray-500">Bajarilgan</p>
        </Card>
        <Card className="p-4 text-center border-l-4 border-red-500">
          <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
          <p className="text-sm text-gray-500">Bekor qilingan</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Qidirish (mijoz, master, xizmat)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
          
          <div className="flex gap-2">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
            />
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="all">Barchasi</option>
              <option value="PENDING">Kutilmoqda</option>
              <option value="CONFIRMED">Tasdiqlangan</option>
              <option value="COMPLETED">Bajarilgan</option>
              <option value="CANCELLED">Bekor qilingan</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Bookings List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-500">Yuklanmoqda...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <Card className="p-12 text-center">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Navbatlar topilmadi</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const statusInfo = statusConfig[booking.status] || statusConfig.PENDING
            const StatusIcon = statusInfo.icon
            
            return (
              <Card key={booking.id} className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Date & Time */}
                  <div className="flex items-center gap-3 md:w-48">
                    <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-rose-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatDate(booking.date)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {booking.startTime} - {booking.endTime}
                      </p>
                    </div>
                  </div>

                  {/* Service */}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {booking.serviceName}
                    </p>
                    <p className="text-sm text-rose-600 font-medium">
                      {formatPrice(booking.finalPrice)}
                      {booking.discountAmount > 0 && (
                        <span className="ml-2 text-gray-400 line-through text-xs">
                          {formatPrice(booking.originalPrice)}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Client */}
                  <div className="flex items-center gap-3 md:w-48">
                    <Avatar 
                      src={booking.client.avatar} 
                      fallback={booking.client.name?.charAt(0) || 'M'} 
                      size="sm" 
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {booking.client.name || 'Mijoz'}
                      </p>
                      <p className="text-xs text-gray-500">{booking.client.phone}</p>
                    </div>
                  </div>

                  {/* Master */}
                  <div className="flex items-center gap-3 md:w-48">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Scissors className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {booking.master.name || 'Master'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {specializationLabels[booking.master.specialization] || booking.master.specialization}
                      </p>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center gap-2">
                    <Badge className={cn('gap-1', statusInfo.color)}>
                      <StatusIcon className="w-3 h-3" />
                      {statusInfo.label}
                    </Badge>
                    
                    {booking.status === 'PENDING' && (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-green-600 hover:bg-green-50"
                          onClick={() => updateStatus(booking.id, 'CONFIRMED')}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => updateStatus(booking.id, 'CANCELLED')}
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    
                    {booking.status === 'CONFIRMED' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-green-600 hover:bg-green-50"
                        onClick={() => updateStatus(booking.id, 'COMPLETED')}
                      >
                        Bajarildi
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
