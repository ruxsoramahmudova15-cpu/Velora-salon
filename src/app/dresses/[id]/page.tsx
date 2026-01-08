'use client'

import { useState, useEffect, use } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  Share2, 
  Calendar,
  Check,
  X,
  Sparkles,
  Crown,
  Star,
  Info
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loading } from '@/components/ui/loading'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface WeddingDress {
  id: string
  name: string
  description: string
  price: number
  rentPrice: number
  image: string
  images: string[]
  size: string
  color: string
  style: string
  timesRented: number
  isAvailable: boolean
}

interface Availability {
  date: string
  isAvailable: boolean
}

export default function DressDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [dress, setDress] = useState<WeddingDress | null>(null)
  const [availability, setAvailability] = useState<Availability[]>([])
  const [depositPercent, setDepositPercent] = useState(30)
  const [isLoading, setIsLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedDates, setSelectedDates] = useState<{ start: string | null; end: string | null }>({
    start: null,
    end: null,
  })
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [isBooking, setIsBooking] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    fetchDress()
  }, [id])

  const fetchDress = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/dresses/${id}`)
      const data = await response.json()
      setDress(data.dress)
      setAvailability(data.availability || [])
      setDepositPercent(data.depositPercent || 30)
    } catch (error) {
      console.error('Error fetching dress:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m'
  }

  const handleDateSelect = (date: string) => {
    const dateAvailability = availability.find(a => a.date === date)
    if (!dateAvailability?.isAvailable) return

    if (!selectedDates.start || (selectedDates.start && selectedDates.end)) {
      setSelectedDates({ start: date, end: null })
    } else {
      if (new Date(date) < new Date(selectedDates.start)) {
        setSelectedDates({ start: date, end: selectedDates.start })
      } else {
        setSelectedDates({ ...selectedDates, end: date })
      }
    }
  }

  const calculateTotal = () => {
    if (!dress || !selectedDates.start) return { days: 0, total: 0, deposit: 0 }
    
    const start = new Date(selectedDates.start)
    const end = selectedDates.end ? new Date(selectedDates.end) : start
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    const total = dress.rentPrice * days
    const deposit = Math.round(total * (depositPercent / 100))
    
    return { days, total, deposit }
  }

  const handleBooking = async () => {
    if (!dress || !selectedDates.start) return
    
    setIsBooking(true)
    try {
      const response = await fetch('/api/bookings/dress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dressId: dress.id,
          startDate: selectedDates.start,
          endDate: selectedDates.end || selectedDates.start,
        }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setBookingSuccess(true)
        setTimeout(() => {
          setIsBookingModalOpen(false)
          setBookingSuccess(false)
          setSelectedDates({ start: null, end: null })
          fetchDress() // Refresh availability
        }, 3000)
      } else {
        alert(data.message || 'Xatolik yuz berdi')
      }
    } catch (error) {
      console.error('Booking error:', error)
      alert('Xatolik yuz berdi')
    } finally {
      setIsBooking(false)
    }
  }

  // Generate calendar days
  const generateCalendarDays = () => {
    const days: { date: string; day: number; month: string; isAvailable: boolean; isSelected: boolean; isInRange: boolean }[] = []
    const today = new Date()
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]
      const avail = availability.find(a => a.date === dateStr)
      
      const isSelected = dateStr === selectedDates.start || dateStr === selectedDates.end
      const isInRange = selectedDates.start && selectedDates.end && 
        new Date(dateStr) > new Date(selectedDates.start) && 
        new Date(dateStr) < new Date(selectedDates.end)
      
      days.push({
        date: dateStr,
        day: date.getDate(),
        month: date.toLocaleDateString('uz-UZ', { month: 'short' }),
        isAvailable: avail?.isAvailable ?? true,
        isSelected,
        isInRange,
      })
    }
    
    return days
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    )
  }

  if (!dress) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Crown className="w-16 h-16 text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Ko'ylak topilmadi</h1>
        <Link href="/dresses">
          <Button>Orqaga qaytish</Button>
        </Link>
      </div>
    )
  }

  const { days, total, deposit } = calculateTotal()
  const calendarDays = generateCalendarDays()

  return (
    <div className="min-h-screen pb-20">
      {/* Back button */}
      <div className="container mx-auto px-4 py-4">
        <Link href="/dresses">
          <Button variant="ghost" className="gap-2">
            <ChevronLeft className="w-4 h-4" />
            Orqaga
          </Button>
        </Link>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-gray-100">
              <motion.img
                key={currentImageIndex}
                src={dress.images?.[currentImageIndex] || dress.image}
                alt={dress.name}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Navigation arrows */}
              {dress.images && dress.images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex(i => i === 0 ? dress.images.length - 1 : i - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 shadow-lg hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex(i => i === dress.images.length - 1 ? 0 : i + 1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 shadow-lg hover:bg-white transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
              
              {/* Favorite & Share */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={cn(
                    "p-3 rounded-full shadow-lg transition-all",
                    isFavorite ? "bg-rose-500 text-white" : "bg-white/90 text-gray-600 hover:bg-white"
                  )}
                >
                  <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
                </button>
                <button className="p-3 rounded-full bg-white/90 shadow-lg hover:bg-white transition-colors">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {dress.timesRented > 20 && (
                  <Badge className="bg-gradient-to-r from-rose-500 to-pink-500 text-white border-0">
                    🔥 Mashhur
                  </Badge>
                )}
                {!dress.isAvailable && (
                  <Badge variant="destructive">Mavjud emas</Badge>
                )}
              </div>
            </div>
            
            {/* Thumbnails */}
            {dress.images && dress.images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {dress.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={cn(
                      "w-20 h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all",
                      currentImageIndex === idx ? "border-rose-500" : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="sticky top-24">
              {/* Title & Info */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{dress.style}</Badge>
                  <Badge variant="outline">{dress.size} o'lcham</Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                  {dress.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {dress.description}
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">4.9</span>
                  <span className="text-gray-500">(24 sharh)</span>
                </div>
                <div className="text-gray-500">
                  {dress.timesRented}x ijaraga berilgan
                </div>
              </div>

              {/* Prices */}
              <Card className="mb-6 border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Ijara narxi (kuniga)</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                        {formatPrice(dress.rentPrice)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Sotib olish</p>
                      <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                        {formatPrice(dress.price)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Calendar */}
              <Card className="mb-6 border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-rose-500" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">Sana tanlang</h3>
                  </div>
                  
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {calendarDays.map((day) => (
                      <button
                        key={day.date}
                        onClick={() => handleDateSelect(day.date)}
                        disabled={!day.isAvailable}
                        className={cn(
                          "flex-shrink-0 w-14 h-16 rounded-xl flex flex-col items-center justify-center transition-all",
                          day.isAvailable 
                            ? "hover:bg-rose-50 dark:hover:bg-rose-900/20 cursor-pointer" 
                            : "opacity-40 cursor-not-allowed bg-gray-100 dark:bg-gray-800",
                          day.isSelected && "bg-rose-500 text-white hover:bg-rose-600",
                          day.isInRange && "bg-rose-100 dark:bg-rose-900/30"
                        )}
                      >
                        <span className="text-xs text-gray-500">{day.month}</span>
                        <span className="text-lg font-semibold">{day.day}</span>
                      </button>
                    ))}
                  </div>
                  
                  {selectedDates.start && (
                    <div className="mt-4 p-4 bg-rose-50 dark:bg-rose-900/20 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Tanlangan:</span>
                        <span className="font-semibold">
                          {selectedDates.start}
                          {selectedDates.end && ` - ${selectedDates.end}`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Kunlar soni:</span>
                        <span className="font-semibold">{days} kun</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Jami:</span>
                        <span className="font-bold text-lg text-rose-500">{formatPrice(total)}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-rose-200 dark:border-rose-800">
                        <span className="text-gray-600 dark:text-gray-400">Depozit ({depositPercent}%):</span>
                        <span className="font-semibold">{formatPrice(deposit)}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Book Button */}
              <Button 
                size="lg" 
                className="w-full rounded-xl py-6 text-lg"
                disabled={!selectedDates.start || !dress.isAvailable}
                onClick={() => setIsBookingModalOpen(true)}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Bron qilish
              </Button>
              
              <p className="text-center text-sm text-gray-500 mt-3 flex items-center justify-center gap-1">
                <Info className="w-4 h-4" />
                Depozit to'lash orqali bron tasdiqlanadi
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => !isBooking && setIsBookingModalOpen(false)}
            />
            
            <motion.div
              className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              {bookingSuccess ? (
                <div className="p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
                  >
                    <Check className="w-10 h-10 text-green-600" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Bron muvaffaqiyatli!
                  </h3>
                  <p className="text-gray-500">
                    Tez orada siz bilan bog'lanamiz
                  </p>
                </div>
              ) : (
                <>
                  <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Bronni tasdiqlash
                      </h3>
                      <button
                        onClick={() => setIsBookingModalOpen(false)}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex gap-4 mb-6">
                      <img 
                        src={dress.image} 
                        alt={dress.name}
                        className="w-24 h-32 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {dress.name}
                        </h4>
                        <p className="text-sm text-gray-500 mb-2">{dress.size} o'lcham</p>
                        <Badge>{selectedDates.start} - {selectedDates.end || selectedDates.start}</Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Ijara ({days} kun)</span>
                        <span className="font-semibold">{formatPrice(total)}</span>
                      </div>
                      <div className="flex justify-between text-lg pt-3 border-t">
                        <span className="font-semibold">Depozit to'lovi</span>
                        <span className="font-bold text-rose-500">{formatPrice(deposit)}</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full rounded-xl py-6"
                      onClick={handleBooking}
                      disabled={isBooking}
                    >
                      {isBooking ? (
                        <Loading size="sm" />
                      ) : (
                        <>
                          <Check className="w-5 h-5 mr-2" />
                          Tasdiqlash
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
