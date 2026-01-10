'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, Clock, User, ChevronLeft, ChevronRight, Check,
  Scissors, Palette, Eye, Heart, Star, Phone, ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar } from '@/components/ui/avatar'
import { Rating } from '@/components/ui/rating'
import { Loading } from '@/components/ui/loading'
import { cn } from '@/lib/utils'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const categories = [
  { id: 'SOCH', name: 'Soch xizmatlari', icon: Scissors },
  { id: 'TIRNOQ', name: 'Tirnoq xizmatlari', icon: Palette },
  { id: 'QOSH', name: 'Qosh va kiprik', icon: Eye },
  { id: 'MAKIYAJ', name: 'Makiyaj', icon: Heart },
]

const services = {
  SOCH: [
    { id: 1, name: 'Soch kesish', price: 80000, duration: 45 },
    { id: 2, name: 'Soch bo\'yash', price: 250000, duration: 120 },
    { id: 3, name: 'Ukladka', price: 100000, duration: 60 },
    { id: 4, name: 'Soch davolash', price: 150000, duration: 90 },
  ],
  TIRNOQ: [
    { id: 5, name: 'Klassik manikyur', price: 60000, duration: 45 },
    { id: 6, name: 'Gel lak', price: 100000, duration: 60 },
    { id: 7, name: 'Nail art', price: 150000, duration: 90 },
    { id: 8, name: 'Pedikyur', price: 80000, duration: 60 },
  ],
  QOSH: [
    { id: 9, name: 'Qosh dizayni', price: 40000, duration: 30 },
    { id: 10, name: 'Qosh bo\'yash', price: 60000, duration: 45 },
    { id: 11, name: 'Kiprik uzaytirish', price: 200000, duration: 120 },
    { id: 12, name: 'Laminirlash', price: 120000, duration: 60 },
  ],
  MAKIYAJ: [
    { id: 13, name: 'Kundalik makiyaj', price: 100000, duration: 45 },
    { id: 14, name: 'Bayram makiyaji', price: 200000, duration: 60 },
    { id: 15, name: 'To\'y makiyaji', price: 400000, duration: 120 },
    { id: 16, name: 'Makiyaj darsi', price: 300000, duration: 120 },
  ],
}

const masters = [
  { id: 1, name: 'Malika Umarova', rating: 4.9, reviews: 128, speciality: 'Soch stilisti', avatar: null },
  { id: 2, name: 'Nilufar Karimova', rating: 4.8, reviews: 95, speciality: 'Manikyur stilisti', avatar: null },
  { id: 3, name: 'Zarina Aliyeva', rating: 4.9, reviews: 156, speciality: 'Makiyaj artisti', avatar: null },
]

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00'
]

function BookingContent() {
  const searchParams = useSearchParams()
  const [step, setStep] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('category'))
  const [selectedService, setSelectedService] = useState<number | null>(null)
  const [selectedMaster, setSelectedMaster] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
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

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSuccess(true)
    setIsSubmitting(false)
  }

  const selectedServiceData = selectedCategory 
    ? services[selectedCategory as keyof typeof services]?.find(s => s.id === selectedService)
    : null

  const selectedMasterData = masters.find(m => m.id === selectedMaster)

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
            <h1 className="text-2xl font-bold light-text-primary mb-2">
              Navbat muvaffaqiyatli olindi!
            </h1>
            <p className="light-text-muted mb-8">
              Tez orada siz bilan bog'lanamiz
            </p>
            
            <Card className="mb-6">
              <CardContent className="p-6 text-left space-y-3">
                <div className="flex justify-between">
                  <span className="light-text-muted">Xizmat:</span>
                  <span className="font-medium light-text-primary">{selectedServiceData?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="light-text-muted">Stilist:</span>
                  <span className="font-medium light-text-primary">{selectedMasterData?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="light-text-muted">Sana:</span>
                  <span className="font-medium light-text-primary">{selectedDate?.toLocaleDateString('uz-UZ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="light-text-muted">Vaqt:</span>
                  <span className="font-medium light-text-primary">{selectedTime}</span>
                </div>
                <div className="flex justify-between border-t border-subtle pt-3">
                  <span className="light-text-muted">Narx:</span>
                  <span className="font-bold text-lg text-accent">{selectedServiceData?.price.toLocaleString()} so'm</span>
                </div>
              </CardContent>
            </Card>

            <Link href="/">
              <Button className="rounded-xl">
                Bosh sahifaga qaytish
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold light-text-primary mb-2">
            Navbat olish
          </h1>
          <p className="light-text-muted">
            O'zingizga qulay vaqtni tanlang
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                step >= s 
                  ? "bg-accent text-white" 
                  : "bg-light-gray light-text-muted"
              )}>
                {step > s ? <Check className="h-4 w-4" /> : s}
              </div>
              {s < 4 && (
                <div className={cn(
                  "w-12 h-1 mx-1 rounded",
                  step > s ? "bg-accent" : "bg-light-gray"
                )} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-xl font-semibold mb-4 light-text-primary">Xizmat turini tanlang</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {categories.map((cat) => (
                  <Card
                    key={cat.id}
                    className={cn(
                      "cursor-pointer transition-all hover:-translate-y-1",
                      selectedCategory === cat.id && "ring-2 ring-accent"
                    )}
                    onClick={() => { setSelectedCategory(cat.id); setSelectedService(null) }}
                  >
                    <CardContent className="p-4 text-center">
                      <cat.icon className={cn(
                        "h-8 w-8 mx-auto mb-2",
                        selectedCategory === cat.id ? "text-accent" : "light-text-muted"
                      )} />
                      <p className="text-sm font-medium light-text-primary">{cat.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {selectedCategory && (
                <>
                  <h2 className="text-xl font-semibold mb-4 light-text-primary">Xizmatni tanlang</h2>
                  <div className="grid gap-3 mb-6">
                    {services[selectedCategory as keyof typeof services]?.map((service) => (
                      <Card
                        key={service.id}
                        className={cn(
                          "cursor-pointer transition-all",
                          selectedService === service.id && "ring-2 ring-accent"
                        )}
                        onClick={() => setSelectedService(service.id)}
                      >
                        <CardContent className="p-4 flex items-center justify-between">
                          <div>
                            <p className="font-medium light-text-primary">{service.name}</p>
                            <p className="text-sm light-text-muted">{service.duration} daqiqa</p>
                          </div>
                          <p className="font-bold text-accent">{service.price.toLocaleString()} so'm</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}

              <Button 
                className="w-full rounded-xl" 
                disabled={!selectedService}
                onClick={() => setStep(2)}
              >
                Davom etish
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-xl font-semibold mb-4 light-text-primary">Stilistni tanlang</h2>
              <div className="grid gap-4 mb-6">
                {masters.map((master) => (
                  <Card
                    key={master.id}
                    className={cn(
                      "cursor-pointer transition-all",
                      selectedMaster === master.id && "ring-2 ring-accent"
                    )}
                    onClick={() => setSelectedMaster(master.id)}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <Avatar fallback={master.name.charAt(0)} size="lg" />
                      <div className="flex-1">
                        <p className="font-semibold light-text-primary">{master.name}</p>
                        <p className="text-sm light-text-muted">{master.speciality}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Rating value={master.rating} size="sm" />
                          <span className="text-xs light-text-muted">({master.reviews})</span>
                        </div>
                      </div>
                      {selectedMaster === master.id && (
                        <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setStep(1)}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Orqaga
                </Button>
                <Button 
                  className="flex-1 rounded-xl" 
                  disabled={!selectedMaster}
                  onClick={() => setStep(3)}
                >
                  Davom etish
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-xl font-semibold mb-4 light-text-primary">Sana va vaqtni tanlang</h2>
              
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <Button variant="ghost" size="icon" onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1))}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="font-medium light-text-primary">
                      {viewMonth.toLocaleDateString('uz-UZ', { month: 'long', year: 'numeric' })}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1))}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
                    {['Ya', 'Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh'].map(d => (
                      <div key={d} className="light-text-muted py-2">{d}</div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1">
                    {getDaysInMonth(viewMonth).map((day, i) => (
                      <button
                        key={i}
                        disabled={!day || day < new Date(new Date().setHours(0,0,0,0))}
                        className={cn(
                          "p-2 rounded-lg text-sm transition-colors light-text-primary",
                          !day && "invisible",
                          day && day < new Date(new Date().setHours(0,0,0,0)) && "light-text-muted opacity-40 cursor-not-allowed",
                          day && selectedDate?.toDateString() === day.toDateString() && "bg-accent text-white",
                          day && selectedDate?.toDateString() !== day.toDateString() && day >= new Date(new Date().setHours(0,0,0,0)) && "hover:bg-light-gray"
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
                <>
                  <h3 className="font-medium mb-3 light-text-primary">Vaqtni tanlang</h3>
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mb-6">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        className={cn(
                          "p-2 rounded-lg text-sm border transition-colors",
                          selectedTime === time 
                            ? "bg-accent text-white border-accent" 
                            : "border-subtle light-text-primary hover:border-accent"
                        )}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setStep(2)}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Orqaga
                </Button>
                <Button 
                  className="flex-1 rounded-xl" 
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => setStep(4)}
                >
                  Davom etish
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-xl font-semibold mb-4 light-text-primary">Ma'lumotlaringiz</h2>
              
              <Card className="mb-6">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block light-text-primary">Ismingiz</label>
                    <Input 
                      placeholder="Malika" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block light-text-primary">Telefon raqam</label>
                    <div className="flex">
                      <div className="flex h-12 items-center rounded-l-xl border-2 border-r-0 border-subtle bg-light-gray px-3 text-sm light-text-muted">
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

              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 light-text-primary">Buyurtma ma'lumotlari</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="light-text-muted">Xizmat:</span>
                      <span className="light-text-primary">{selectedServiceData?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="light-text-muted">Stilist:</span>
                      <span className="light-text-primary">{selectedMasterData?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="light-text-muted">Sana:</span>
                      <span className="light-text-primary">{selectedDate?.toLocaleDateString('uz-UZ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="light-text-muted">Vaqt:</span>
                      <span className="light-text-primary">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between border-t border-subtle pt-2 mt-2">
                      <span className="font-medium light-text-primary">Jami:</span>
                      <span className="font-bold text-lg text-accent">{selectedServiceData?.price.toLocaleString()} so'm</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setStep(3)}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Orqaga
                </Button>
                <Button 
                  className="flex-1 rounded-xl" 
                  disabled={!name || phone.replace(/\s/g, '').length !== 9 || isSubmitting}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? 'Yuborilmoqda...' : 'Tasdiqlash'}
                  <Check className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    }>
      <BookingContent />
    </Suspense>
  )
}
