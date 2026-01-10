'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Search,
  Package,
  User,
  Phone,
  DollarSign
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface DressRental {
  id: string
  startDate: string
  endDate: string
  status: string
  totalPrice: number
  depositAmount: number
  depositPaid: boolean
  notes?: string
  dress: {
    id: string
    name: string
    image: string
    size: string
    color: string
    rentPrice: number
  }
  client: {
    id: string
    name: string
    phone: string
    avatar?: string
  }
  createdAt: string
}

interface Stats {
  total: number
  pending: number
  confirmed: number
  active: number
  returned: number
  cancelled: number
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  PENDING: { label: 'Kutilmoqda', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
  CONFIRMED: { label: 'Tasdiqlangan', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  ACTIVE: { label: 'Ijarada', color: 'bg-green-100 text-green-800', icon: Package },
  RETURNED: { label: 'Qaytarilgan', color: 'bg-gray-100 text-gray-800', icon: CheckCircle },
  CANCELLED: { label: 'Bekor qilingan', color: 'bg-red-100 text-red-800', icon: XCircle }
}

export default function AdminDressRentalsPage() {
  const [rentals, setRentals] = useState<DressRental[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, confirmed: 0, active: 0, returned: 0, cancelled: 0 })
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchRentals()
  }, [filter])

  const fetchRentals = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filter !== 'all') params.append('status', filter)
      
      const res = await fetch(`/api/admin/dress-rentals?${params}`)
      const data = await res.json()
      
      if (data.success) {
        setRentals(data.data)
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
      const res = await fetch('/api/admin/dress-rentals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      })
      
      if (res.ok) {
        fetchRentals()
      }
    } catch (error) {
      console.error('Update error:', error)
    }
  }

  const toggleDeposit = async (id: string, depositPaid: boolean) => {
    try {
      const res = await fetch('/api/admin/dress-rentals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, depositPaid })
      })
      
      if (res.ok) {
        fetchRentals()
      }
    } catch (error) {
      console.error('Update error:', error)
    }
  }

  const filteredRentals = rentals.filter(rental => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      rental.client.name?.toLowerCase().includes(query) ||
      rental.client.phone.includes(query) ||
      rental.dress.name.toLowerCase().includes(query)
    )
  })

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('uz-UZ', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m'
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
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
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          <p className="text-sm text-gray-500">Ijarada</p>
        </Card>
        <Card className="p-4 text-center border-l-4 border-gray-500">
          <p className="text-2xl font-bold text-gray-600">{stats.returned}</p>
          <p className="text-sm text-gray-500">Qaytarilgan</p>
        </Card>
        <Card className="p-4 text-center border-l-4 border-red-500">
          <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
          <p className="text-sm text-gray-500">Bekor</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Qidirish (mijoz, ko'ylak nomi)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="all">Barchasi</option>
            <option value="PENDING">Kutilmoqda</option>
            <option value="CONFIRMED">Tasdiqlangan</option>
            <option value="ACTIVE">Ijarada</option>
            <option value="RETURNED">Qaytarilgan</option>
            <option value="CANCELLED">Bekor qilingan</option>
          </select>
        </div>
      </Card>

      {/* Rentals List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-500">Yuklanmoqda...</p>
        </div>
      ) : filteredRentals.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Ko'ylak ijaralari topilmadi</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRentals.map((rental) => {
            const statusInfo = statusConfig[rental.status] || statusConfig.PENDING
            const StatusIcon = statusInfo.icon
            
            return (
              <Card key={rental.id} className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Dress Image */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    <img 
                      src={rental.dress.image} 
                      alt={rental.dress.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Dress Info */}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {rental.dress.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      O'lcham: {rental.dress.size} | Rang: {rental.dress.color}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="flex items-center gap-1 text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                      </span>
                    </div>
                  </div>

                  {/* Client */}
                  <div className="flex items-center gap-3 md:w-48">
                    <Avatar 
                      src={rental.client.avatar} 
                      fallback={rental.client.name?.charAt(0) || 'M'} 
                      size="sm" 
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {rental.client.name}
                      </p>
                      <p className="text-xs text-gray-500">{rental.client.phone}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="md:w-40 text-right">
                    <p className="font-bold text-rose-600">{formatPrice(rental.totalPrice)}</p>
                    <p className="text-xs text-gray-500">
                      Zalog: {formatPrice(rental.depositAmount)}
                      {rental.depositPaid ? (
                        <span className="ml-1 text-green-600">✓</span>
                      ) : (
                        <span className="ml-1 text-red-600">✗</span>
                      )}
                    </p>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={cn('gap-1', statusInfo.color)}>
                      <StatusIcon className="w-3 h-3" />
                      {statusInfo.label}
                    </Badge>
                    
                    <div className="flex gap-1">
                      {rental.status === 'PENDING' && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-green-600 hover:bg-green-50 text-xs"
                            onClick={() => updateStatus(rental.id, 'CONFIRMED')}
                          >
                            Tasdiqlash
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:bg-red-50 text-xs"
                            onClick={() => updateStatus(rental.id, 'CANCELLED')}
                          >
                            Bekor
                          </Button>
                        </>
                      )}
                      
                      {rental.status === 'CONFIRMED' && (
                        <>
                          {!rental.depositPaid && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-blue-600 hover:bg-blue-50 text-xs"
                              onClick={() => toggleDeposit(rental.id, true)}
                            >
                              Zalog to'landi
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-green-600 hover:bg-green-50 text-xs"
                            onClick={() => updateStatus(rental.id, 'ACTIVE')}
                          >
                            Berildi
                          </Button>
                        </>
                      )}
                      
                      {rental.status === 'ACTIVE' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-gray-600 hover:bg-gray-50 text-xs"
                          onClick={() => updateStatus(rental.id, 'RETURNED')}
                        >
                          Qaytarildi
                        </Button>
                      )}
                    </div>
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
