'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, ChevronLeft, ChevronRight, Check, Crown,
  Phone, User, ArrowRight, Clock, CreditCard
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

const dresses = [
  { id: 1, name: 'Shaxzoda Ko\'ylak', image: '/dresses/download.jpg', price: 1800000, deposit: 540000 },
  { id: 2, name: 'Baliq Dumi', image: '/dresses/download (1).jpg', price: 1400000, deposit: 420000 },
  { id: 3, name: 'Qirollik Ko\'ylak', image: '/dresses/download (2).jpg', price: 2200000, deposit: 660000 },
  { id: 4, name: 'Klassik A-Shakl', image: '/dresses/images.jpg', price: 750000, deposit: 225000 },
  { id: 5, name: 'Romantik Ko\'ylak', image: '/dresses/download (3).jpg', price: 1200000, deposit: 360000 },
  { id: 6, name: 'Zamonaviy Stil', image: '/dresses/download (4).jpg', price: 1600000, deposit: 480000 },
]

function BookDressContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const dressId = searchParams.get('id')
  
  const [step, setStep] = useState(1)
  const [selectedDress, setSelectedDress] = useState<number | null>(dressId ? parseInt(dressId) : null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [returnDate, setReturnDate] = useState<Date | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const currentMonth = new Date()
  const [viewMonth, setViewMonth] = useState(currentMonth)

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days = []
    
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null)
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }
    
    return days
  }

  const formatPhoneInput = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 2) return numbers
    if (numbers.length <= 5) return `${numbers.slice(0, 2)} ${numbers.slice(2)}`
    if (numbers.length <= 7) return `${numbers.slice(0, 2)} ${numbers.slice(2, 5)} ${numbers.slice(5)}`
    return `${numbers.slice(0, 2)} ${numbers.slice(2, 5)} ${numbers.slice(5, 7)} ${numbers.slice(7, 9)}`
  }

  useEffect(() => {
    if (selectedDate) {
      const nextDay = new Date(selectedDate)
      nextDay.setDate(nextDay.getDate() + 1)
      setReturnDate(nextDay)
    }
  }, [selectedDate])

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSuccess(true)
    setIsSubmitting(false)
  }

  const selectedDressData = dresses.find(d => d.id === selectedDress)

  if (isSuccess) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-lg">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Bron muvaffaqiyatli qilindi!
            </h1>
            <p className="text-gray-500 mb-8">
              Tez orada siz bilan bog'lanamiz
            </p>
            
            <Card className="mb-6">
              <CardContent className="p-6 text-left space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Ko'ylak:</span>
                  <span className="font-medium">{selectedDressData?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Olish sanasi:</span>
                  <span className="font-medium">{selectedDate?.toLocaleDateString('uz-UZ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Qaytarish sanasi:</span>
                  <span className="font-medium">{returnDate?.toLocaleDateString('uz-UZ')}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-gray-500">Ijara narxi:</span>
                  <span className="font-bold">{selectedDressData?.price.toLocaleString()} so'm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Oldindan to'lov (30%):</span>
                  <span className="font-bold text-rose-500">{selectedDressData?.deposit.toLocaleString()} so'm</span>
                </div>
              </CardContent>
            </Card>

            <p className="text-sm text-gray-500 mb-6">
              Oldindan to'lovni amalga oshirish uchun siz bilan bog'lanamiz
            </p>

            <Link href="/dresses">
              <Button className="rounded-xl">
                Ko'ylaklarga qaytish
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="mb-4 px-4 py-2 bg-gray-100 dark:bg-gray-800">
            <Crown className="w-4 h-4 mr-2" />
            Kelin ko'ylak
          </Badge>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Ko'ylak bron qilish
          </h1>
          <p className="text-gray-500">
            O'zingizga yoqqan ko'ylakni bron qiling
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                step >= s 
                  ? "bg-rose-500 text-white" 
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500"
              )}>
                {step > s ? <Check className="h-4 w-4" /> : s}
              </div>
              {s < 3 && (
                <div className={cn(
                  "w-16 h-1 mx-1 rounded",
                  step > s ? "bg-rose-500" : "bg-gray-200 dark:bg-gray-700"
                )} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Select Dress */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-xl font-semibold mb-4">Ko'ylakni tanlang</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {dresses.map((dress) => (
                <Card
                  key={dress.id}
                  className={cn(
                    "cursor-pointer overflow-hidden transition-all hover:-translate-y-1",
                    selectedDress === dress.id && "ring-2 ring-rose-500"
                  )}
                  onClick={() => setSelectedDress(dress.id)}
                >
                  <div className="aspect-[3/4] relative">
                    <img src={dress.image} alt={dress.name} className="w-full h-full object-cover" />
                    {selectedDress === dress.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <p className="font-medium text-sm">{dress.name}</p>
                    <p className="text-rose-500 font-bold">{dress.price.toLocaleString()} so'm</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button 
              className="w-full rounded-xl" 
              disabled={!selectedDress}
              onClick={() => setStep(2)}
            >
              Davom etish
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        )}

        {/* Step 2: Select Date */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-xl font-semibold mb-4">Sanani tanlang</h2>
            
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <Button variant="ghost" size="icon" onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1))}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="font-medium">
                    {viewMonth.toLocaleDateString('uz-UZ', { month: 'long', year: 'numeric' })}
                  </span>
                  <Button variant="ghost" size="icon" onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1))}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
                  {['Ya', 'Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh'].map(d => (
                    <div key={d} className="text-gray-500 py-2">{d}</div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {getDaysInMonth(viewMonth).map((day, i) => (
                    <button
                      key={i}
                      disabled={!day || day < new Date(new Date().setHours(0,0,0,0))}
                      className={cn(
                        "p-2 rounded-lg text-sm transition-colors",
                        !day && "invisible",
                        day && day < new Date(new Date().setHours(0,0,0,0)) && "text-gray-300 cursor-not-allowed",
                        day && selectedDate?.toDateString() === day.toDateString() && "bg-rose-500 text-white",
                        day && selectedDate?.toDateString() !== day.toDateString() && day >= new Date(new Date().setHours(0,0,0,0)) && "hover:bg-gray-100 dark:hover:bg-gray-800"
                      )}
                      onClick={() => day && setSelectedDate(day)}
                    >
                      {day?.getDate()}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {selectedDate && (
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-gray-500">Olish sanasi</p>
                      <p className="font-medium">{selectedDate.toLocaleDateString('uz-UZ')}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 mx-2" />
                    <div>
                      <p className="text-gray-500">Qaytarish sanasi</p>
                      <p className="font-medium">{returnDate?.toLocaleDateString('uz-UZ')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setStep(1)}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Orqaga
              </Button>
              <Button 
                className="flex-1 rounded-xl" 
                disabled={!selectedDate}
                onClick={() => setStep(3)}
              >
                Davom etish
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Contact Info */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-xl font-semibold mb-4">Ma'lumotlaringiz</h2>
            
            <Card className="mb-6">
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Ismingiz</label>
                  <Input 
                    placeholder="Malika Karimova" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Telefon raqam</label>
                  <div className="flex">
                    <div className="flex h-12 items-center rounded-l-xl border-2 border-r-0 border-gray-200 bg-gray-50 px-3 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800">
                      +998
                    </div>
                    <Input
                      type="tel"
                      placeholder="90 123 45 67"
                      value={phone}
                      onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
                      className="rounded-l-none"
                      maxLength={12}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Bron ma'lumotlari</h3>
                <div className="flex gap-4 mb-4">
                  <img src={selectedDressData?.image} alt="" className="w-20 h-28 object-cover rounded-lg" />
                  <div>
                    <p className="font-semibold">{selectedDressData?.name}</p>
                    <p className="text-sm text-gray-500">Olish: {selectedDate?.toLocaleDateString('uz-UZ')}</p>
                    <p className="text-sm text-gray-500">Qaytarish: {returnDate?.toLocaleDateString('uz-UZ')}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Ijara narxi:</span>
                    <span className="font-medium">{selectedDressData?.price.toLocaleString()} so'm</span>
                  </div>
                  <div className="flex justify-between text-rose-500">
                    <span>Oldindan to'lov (30%):</span>
                    <span className="font-bold">{selectedDressData?.deposit.toLocaleString()} so'm</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setStep(2)}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Orqaga
              </Button>
              <Button 
                className="flex-1 rounded-xl" 
                disabled={!name || phone.replace(/\s/g, '').length !== 9 || isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? 'Yuborilmoqda...' : 'Bron qilish'}
                <Check className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default function BookDressPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Yuklanmoqda...</div>}>
      <BookDressContent />
    </Suspense>
  )
}
