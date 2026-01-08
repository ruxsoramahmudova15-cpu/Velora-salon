'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Download,
  Phone,
  Calendar,
  DollarSign,
  Star,
  Gift,
  MoreVertical
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'

interface Client {
  id: string
  name: string
  phone: string
  avatar: string | null
  registeredAt: string
  totalVisits: number
  totalSpent: number
  bonusBalance: number
  lastVisit: string | null
}

const mockClients: Client[] = [
  { id: '1', name: 'Madina Aliyeva', phone: '+998901234567', avatar: null, registeredAt: '2025-06-15', totalVisits: 12, totalSpent: 2400000, bonusBalance: 120000, lastVisit: '2026-01-02' },
  { id: '2', name: 'Nilufar Karimova', phone: '+998901234568', avatar: null, registeredAt: '2025-08-20', totalVisits: 8, totalSpent: 1600000, bonusBalance: 80000, lastVisit: '2025-12-28' },
  { id: '3', name: 'Zarina Umarova', phone: '+998901234569', avatar: null, registeredAt: '2025-10-10', totalVisits: 5, totalSpent: 750000, bonusBalance: 37500, lastVisit: '2026-01-03' },
  { id: '4', name: 'Gulnora Saidova', phone: '+998901234570', avatar: null, registeredAt: '2025-11-05', totalVisits: 3, totalSpent: 450000, bonusBalance: 22500, lastVisit: '2025-12-15' },
  { id: '5', name: 'Dilnoza Rahimova', phone: '+998901234571', avatar: null, registeredAt: '2025-12-01', totalVisits: 2, totalSpent: 200000, bonusBalance: 10000, lastVisit: '2026-01-01' },
]

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>(mockClients)
  const [search, setSearch] = useState('')

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(search.toLowerCase()) ||
    client.phone.includes(search)
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m'
  }

  const formatDate = (date: string | null) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('uz-UZ')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mijozlar</h1>
          <p className="text-gray-500">Barcha mijozlarni ko'ring va boshqaring</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          CSV eksport
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{clients.length}</p>
            <p className="text-sm text-gray-500">Jami mijozlar</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-500">
              {clients.filter(c => c.totalVisits >= 5).length}
            </p>
            <p className="text-sm text-gray-500">Doimiy mijozlar</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-rose-500">
              {formatPrice(clients.reduce((acc, c) => acc + c.totalSpent, 0))}
            </p>
            <p className="text-sm text-gray-500">Jami xarajat</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-500">
              {formatPrice(clients.reduce((acc, c) => acc + c.bonusBalance, 0))}
            </p>
            <p className="text-sm text-gray-500">Jami bonuslar</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Ism yoki telefon bo'yicha qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Mijoz</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Ro'yxatdan</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Tashriflar</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Jami xarajat</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Bonus</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Oxirgi tashrif</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredClients.map((client, idx) => (
                <motion.tr
                  key={client.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <Avatar fallback={client.name.charAt(0)} size="sm" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{client.name}</p>
                        <p className="text-sm text-gray-500">{client.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(client.registeredAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{client.totalVisits}</span>
                      {client.totalVisits >= 5 && (
                        <Badge variant="success" className="ml-2">Doimiy</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-rose-500">
                    {formatPrice(client.totalSpent)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Gift className="w-4 h-4 text-purple-500" />
                      <span className="font-medium text-purple-500">
                        {formatPrice(client.bonusBalance)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(client.lastVisit)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
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
