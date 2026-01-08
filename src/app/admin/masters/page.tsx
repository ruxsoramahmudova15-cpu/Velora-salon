'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MoreVertical,
  Star,
  Phone,
  Calendar,
  DollarSign,
  Eye,
  EyeOff
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Loading } from '@/components/ui/loading'
import { cn } from '@/lib/utils'

interface Master {
  id: string
  uniqueCode: string
  user: {
    name: string
    phone: string
    avatar: string | null
  }
  specialization: string
  experienceYears: number
  averageRating: number
  totalReviews: number
  isAvailable: boolean
  todayAppointments?: number
  monthlyRevenue?: number
}

const specializationLabels: Record<string, string> = {
  SOCH: 'Soch stilisti',
  TIRNOQ: 'Tirnoq stilisti',
  QOSH: 'Qosh/Kiprik stilisti',
  MAKIYAJ: 'Makiyajchi',
}

const mockMasters: Master[] = [
  {
    id: '1',
    uniqueCode: 'UST-00001',
    user: { name: 'Malika Umarova', phone: '+998901234567', avatar: null },
    specialization: 'SOCH',
    experienceYears: 5,
    averageRating: 4.9,
    totalReviews: 128,
    isAvailable: true,
    todayAppointments: 6,
    monthlyRevenue: 12800000,
  },
  {
    id: '2',
    uniqueCode: 'UST-00002',
    user: { name: 'Nilufar Saidova', phone: '+998901234568', avatar: null },
    specialization: 'TIRNOQ',
    experienceYears: 3,
    averageRating: 4.8,
    totalReviews: 89,
    isAvailable: true,
    todayAppointments: 8,
    monthlyRevenue: 11200000,
  },
  {
    id: '3',
    uniqueCode: 'UST-00003',
    user: { name: 'Zarina Karimova', phone: '+998901234569', avatar: null },
    specialization: 'QOSH',
    experienceYears: 4,
    averageRating: 4.9,
    totalReviews: 156,
    isAvailable: true,
    todayAppointments: 5,
    monthlyRevenue: 9800000,
  },
  {
    id: '4',
    uniqueCode: 'UST-00004',
    user: { name: 'Madina Aliyeva', phone: '+998901234570', avatar: null },
    specialization: 'MAKIYAJ',
    experienceYears: 6,
    averageRating: 4.7,
    totalReviews: 67,
    isAvailable: false,
    todayAppointments: 0,
    monthlyRevenue: 8700000,
  },
]

export default function AdminMastersPage() {
  const [masters, setMasters] = useState<Master[]>(mockMasters)
  const [isLoading, setIsLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('ALL')

  const filteredMasters = masters.filter(master => {
    const matchesSearch = master.user.name.toLowerCase().includes(search.toLowerCase()) ||
                         master.user.phone.includes(search)
    const matchesSpec = selectedSpecialization === 'ALL' || master.specialization === selectedSpecialization
    return matchesSearch && matchesSpec
  })

  const toggleAvailability = (id: string) => {
    setMasters(prev => prev.map(m => 
      m.id === id ? { ...m, isAvailable: !m.isAvailable } : m
    ))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Stilistlar</h1>
          <p className="text-gray-500">Barcha stilistlarni boshqaring</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Yangi stilist qo'shish
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Ism yoki telefon bo'yicha qidirish..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['ALL', 'SOCH', 'TIRNOQ', 'QOSH', 'MAKIYAJ'].map((spec) => (
                <Button
                  key={spec}
                  variant={selectedSpecialization === spec ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSpecialization(spec)}
                >
                  {spec === 'ALL' ? 'Barchasi' : specializationLabels[spec]}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{masters.length}</p>
            <p className="text-sm text-gray-500">Jami stilistlar</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-500">{masters.filter(m => m.isAvailable).length}</p>
            <p className="text-sm text-gray-500">Faol</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {(masters.reduce((acc, m) => acc + m.averageRating, 0) / masters.length).toFixed(1)}
            </p>
            <p className="text-sm text-gray-500">O'rtacha reyting</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-rose-500">
              {masters.reduce((acc, m) => acc + (m.todayAppointments || 0), 0)}
            </p>
            <p className="text-sm text-gray-500">Bugungi navbatlar</p>
          </CardContent>
        </Card>
      </div>

      {/* Masters Table */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stilist
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mutaxassislik
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reyting
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bugun
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Oylik daromad
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Holat
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredMasters.map((master, idx) => (
                <motion.tr
                  key={master.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <Avatar fallback={master.user.name.charAt(0)} size="sm" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {master.user.name}
                        </p>
                        <p className="text-sm text-gray-500">{master.user.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="secondary">
                      {specializationLabels[master.specialization]}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{master.averageRating}</span>
                      <span className="text-gray-500">({master.totalReviews})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{master.todayAppointments || 0} navbat</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-rose-500">
                      {formatPrice(master.monthlyRevenue || 0)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleAvailability(master.id)}
                      className={cn(
                        "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors",
                        master.isAvailable 
                          ? "bg-green-100 text-green-700 hover:bg-green-200" 
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                    >
                      {master.isAvailable ? (
                        <>
                          <Eye className="w-3 h-3" />
                          Faol
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          Nofaol
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
