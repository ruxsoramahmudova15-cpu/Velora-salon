'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  Scissors,
  Crown,
  BarChart3,
  PieChart
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type ReportType = 'revenue' | 'services' | 'masters' | 'clients' | 'dresses'

const reportTypes = [
  { id: 'revenue', name: 'Daromad', icon: DollarSign, color: 'text-green-500' },
  { id: 'services', name: 'Xizmatlar', icon: Scissors, color: 'text-rose-500' },
  { id: 'masters', name: 'Stilistlar', icon: Users, color: 'text-blue-500' },
  { id: 'clients', name: 'Mijozlar', icon: Users, color: 'text-purple-500' },
  { id: 'dresses', name: 'Ko\'ylaklar', icon: Crown, color: 'text-amber-500' },
]

const dateRanges = [
  { id: 'today', name: 'Bugun' },
  { id: 'week', name: 'Bu hafta' },
  { id: 'month', name: 'Bu oy' },
  { id: 'quarter', name: 'Chorak' },
  { id: 'year', name: 'Yil' },
]

export default function AdminReportsPage() {
  const [selectedReport, setSelectedReport] = useState<ReportType>('revenue')
  const [selectedRange, setSelectedRange] = useState('month')

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m'
  }

  // Mock data
  const revenueData = {
    total: 58000000,
    growth: 12,
    byCategory: [
      { name: 'Soch xizmatlari', amount: 22000000, percent: 38 },
      { name: 'Tirnoq xizmatlari', amount: 18000000, percent: 31 },
      { name: 'Qosh/Kiprik', amount: 12000000, percent: 21 },
      { name: 'Makiyaj', amount: 6000000, percent: 10 },
    ],
    byMaster: [
      { name: 'Malika U.', amount: 12800000 },
      { name: 'Nilufar S.', amount: 11200000 },
      { name: 'Zarina K.', amount: 9800000 },
      { name: 'Madina A.', amount: 8700000 },
    ],
    daily: [
      { day: 'Dush', amount: 2100000 },
      { day: 'Sesh', amount: 1800000 },
      { day: 'Chor', amount: 2400000 },
      { day: 'Pay', amount: 2200000 },
      { day: 'Jum', amount: 3100000 },
      { day: 'Shan', amount: 3800000 },
      { day: 'Yak', amount: 1200000 },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hisobotlar</h1>
          <p className="text-gray-500">Batafsil statistika va tahlillar</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            PDF
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            CSV
          </Button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {reportTypes.map((type) => (
          <Button
            key={type.id}
            variant={selectedReport === type.id ? 'default' : 'outline'}
            className="gap-2 whitespace-nowrap"
            onClick={() => setSelectedReport(type.id as ReportType)}
          >
            <type.icon className={cn("w-4 h-4", selectedReport === type.id ? "text-white" : type.color)} />
            {type.name}
          </Button>
        ))}
      </div>

      {/* Date Range */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-gray-500">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">Davr:</span>
            </div>
            {dateRanges.map((range) => (
              <Button
                key={range.id}
                variant={selectedRange === range.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedRange(range.id)}
              >
                {range.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Report */}
      {selectedReport === 'revenue' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Summary Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="w-8 h-8 text-green-500" />
                  <Badge variant="success">+{revenueData.growth}%</Badge>
                </div>
                <p className="text-sm text-gray-500">Jami daromad</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(revenueData.total)}
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-8 h-8 text-rose-500" />
                </div>
                <p className="text-sm text-gray-500">O'rtacha kunlik</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(Math.round(revenueData.total / 30))}
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
                <p className="text-sm text-gray-500">Jami tranzaksiyalar</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">847</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <BarChart3 className="w-8 h-8 text-purple-500" />
                </div>
                <p className="text-sm text-gray-500">O'rtacha chek</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(Math.round(revenueData.total / 847))}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* By Category */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-rose-500" />
                  Kategoriya bo'yicha
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueData.byCategory.map((cat, idx) => (
                    <div key={cat.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{cat.name}</span>
                        <span className="text-sm text-gray-500">{cat.percent}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className={cn(
                            "h-full rounded-full",
                            idx === 0 ? "bg-rose-500" :
                            idx === 1 ? "bg-purple-500" :
                            idx === 2 ? "bg-amber-500" : "bg-pink-500"
                          )}
                          initial={{ width: 0 }}
                          animate={{ width: `${cat.percent}%` }}
                          transition={{ duration: 1, delay: idx * 0.1 }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{formatPrice(cat.amount)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* By Master */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-rose-500" />
                  Stilist bo'yicha
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueData.byMaster.map((master, idx) => (
                    <div key={master.name} className="flex items-center gap-4">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm",
                        idx === 0 ? "bg-yellow-500" : 
                        idx === 1 ? "bg-gray-400" : 
                        idx === 2 ? "bg-amber-600" : "bg-gray-300"
                      )}>
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{master.name}</p>
                      </div>
                      <p className="font-semibold text-rose-500">{formatPrice(master.amount)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Daily Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-rose-500" />
                Haftalik daromad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between gap-2 h-48">
                {revenueData.daily.map((day, idx) => {
                  const maxAmount = Math.max(...revenueData.daily.map(d => d.amount))
                  const height = (day.amount / maxAmount) * 100
                  return (
                    <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                      <motion.div
                        className="w-full bg-gradient-to-t from-rose-500 to-pink-400 rounded-t-lg"
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                      />
                      <span className="text-xs text-gray-500">{day.day}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Other report types - placeholder */}
      {selectedReport !== 'revenue' && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {reportTypes.find(r => r.id === selectedReport)?.name} hisoboti
            </h3>
            <p className="text-gray-500">
              Bu hisobot tez orada qo'shiladi
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
