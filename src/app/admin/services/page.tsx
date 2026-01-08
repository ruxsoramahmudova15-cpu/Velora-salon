'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Clock,
  DollarSign,
  Eye,
  EyeOff,
  Scissors,
  Palette,
  Heart
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Service {
  id: string
  name: string
  description: string
  category: string
  basePrice: number
  minPrice: number
  maxPrice: number
  duration: number
  isActive: boolean
  popularity: number
}

const categoryLabels: Record<string, string> = {
  SOCH: 'Soch',
  TIRNOQ: 'Tirnoq',
  QOSH: 'Qosh/Kiprik',
  MAKIYAJ: 'Makiyaj',
}

const mockServices: Service[] = [
  { id: '1', name: 'Soch kesish', description: 'Professional soch kesish', category: 'SOCH', basePrice: 50000, minPrice: 40000, maxPrice: 150000, duration: 30, isActive: true, popularity: 156 },
  { id: '2', name: 'Soch bo\'yash', description: 'Sifatli bo\'yoqlar bilan', category: 'SOCH', basePrice: 200000, minPrice: 150000, maxPrice: 500000, duration: 120, isActive: true, popularity: 89 },
  { id: '3', name: 'Gel lak', description: '2-3 hafta davom etadi', category: 'TIRNOQ', basePrice: 100000, minPrice: 80000, maxPrice: 180000, duration: 60, isActive: true, popularity: 234 },
  { id: '4', name: 'Qosh laminatsiya', description: '6-8 hafta davom etadi', category: 'QOSH', basePrice: 150000, minPrice: 100000, maxPrice: 250000, duration: 45, isActive: true, popularity: 134 },
  { id: '5', name: 'To\'y makiyaji', description: 'Kelin uchun professional', category: 'MAKIYAJ', basePrice: 400000, minPrice: 300000, maxPrice: 800000, duration: 90, isActive: true, popularity: 67 },
]

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>(mockServices)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(search.toLowerCase())
    const matchesCat = selectedCategory === 'ALL' || service.category === selectedCategory
    return matchesSearch && matchesCat
  })

  const toggleActive = (id: string) => {
    setServices(prev => prev.map(s => 
      s.id === id ? { ...s, isActive: !s.isActive } : s
    ))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Xizmatlar</h1>
          <p className="text-gray-500">Xizmatlar katalogini boshqaring</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Yangi xizmat qo'shish
        </Button>
      </div>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Xizmat nomini qidirish..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['ALL', 'SOCH', 'TIRNOQ', 'QOSH', 'MAKIYAJ'].map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat === 'ALL' ? 'Barchasi' : categoryLabels[cat]}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service, idx) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className={cn(
              "border-0 shadow-lg hover:shadow-xl transition-all",
              !service.isActive && "opacity-60"
            )}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <Badge variant="secondary">{categoryLabels[service.category]}</Badge>
                  <button
                    onClick={() => toggleActive(service.id)}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      service.isActive 
                        ? "bg-green-100 text-green-600 hover:bg-green-200" 
                        : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                    )}
                  >
                    {service.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {service.name}
                </h3>
                <p className="text-sm text-gray-500 mb-4">{service.description}</p>
                
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {service.duration} daqiqa
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {service.popularity} bron
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl mb-4">
                  <p className="text-xs text-gray-500 mb-1">Narx oralig'i</p>
                  <p className="font-semibold text-rose-500">
                    {formatPrice(service.minPrice)} - {formatPrice(service.maxPrice)} so'm
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-1">
                    <Edit className="w-4 h-4" />
                    Tahrirlash
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
