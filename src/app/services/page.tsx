'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Scissors, 
  Palette, 
  Eye, 
  Heart, 
  Clock, 
  Star,
  ChevronRight,
  X,
  Sparkles,
  TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loading } from '@/components/ui/loading'
import { cn } from '@/lib/utils'
import Link from 'next/link'

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

interface Category {
  id: string
  name: string
  icon: string
  description: string
  serviceCount: number
  color: string
}

const iconMap: Record<string, any> = {
  scissors: Scissors,
  palette: Palette,
  eye: Eye,
  heart: Heart,
}

const colorMap: Record<string, string> = {
  rose: 'from-rose-500 to-pink-600',
  purple: 'from-purple-500 to-violet-600',
  amber: 'from-amber-500 to-orange-600',
  pink: 'from-pink-500 to-rose-600',
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  useEffect(() => {
    fetchServices()
  }, [selectedCategory])

  const fetchServices = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCategory !== 'ALL') {
        params.set('category', selectedCategory)
      }
      
      const response = await fetch(`/api/services?${params}`)
      const data = await response.json()
      setServices(data.services || [])
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price)
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} daqiqa`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours} soat ${mins} daqiqa` : `${hours} soat`
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut' as const,
      },
    },
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden hero-section-gold">
        <div className="absolute top-10 left-10 w-64 h-64 hero-glow-1 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 hero-glow-2 rounded-full blur-3xl" />
        
        <div className="container relative mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              20+ Professional Xizmatlar
            </Badge>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="light-text-primary">Bizning </span>
            <span className="text-gradient">
              Xizmatlarimiz
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-lg light-text-secondary max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Eng sifatli go'zallik xizmatlari. Professional stilistlar tomonidan bajariladi.
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Categories Grid */}
        {categories.length > 0 && (
          <motion.div 
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {categories.map((category) => {
              const Icon = iconMap[category.icon] || Sparkles
              return (
                <motion.div key={category.id} variants={itemVariants}>
                  <Card 
                    className={cn(
                      "cursor-pointer border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
                      selectedCategory === category.id 
                        ? "border-accent shadow-lg" 
                        : "border-transparent hover:border-accent/30"
                    )}
                    onClick={() => setSelectedCategory(
                      selectedCategory === category.id ? 'ALL' : category.id
                    )}
                  >
                    <CardContent className="p-6">
                      <div className={cn(
                        "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4",
                        colorMap[category.color]
                      )}>
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold light-text-primary mb-1">
                        {category.name}
                      </h3>
                      <p className="text-sm light-text-muted mb-3">
                        {category.description}
                      </p>
                      <Badge variant="secondary">
                        {category.serviceCount} xizmat
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {/* Services List */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold light-text-primary">
              {selectedCategory === 'ALL' 
                ? 'Barcha xizmatlar' 
                : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            {selectedCategory !== 'ALL' && (
              <Button 
                variant="ghost" 
                onClick={() => setSelectedCategory('ALL')}
                className="text-accent"
              >
                Barchasini ko'rish
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loading size="lg" />
            </div>
          ) : (
            <motion.div 
              className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {services.map((service) => (
                <motion.div 
                  key={service.id} 
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className="group cursor-pointer h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                    onClick={() => setSelectedService(service)}
                  >
                    <CardContent className="p-6">
                      {/* Popularity badge */}
                      {service.popularity > 100 && (
                        <Badge className="mb-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white border-0">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Mashhur
                        </Badge>
                      )}
                      
                      <h3 className="text-lg font-semibold light-text-primary mb-2 group-hover:text-accent transition-colors">
                        {service.name}
                      </h3>
                      
                      <p className="text-sm light-text-muted mb-4 line-clamp-2">
                        {service.description}
                      </p>
                      
                      <div className="flex items-center gap-4 mb-4 text-sm light-text-muted">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDuration(service.duration)}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-subtle">
                        <div>
                          <p className="text-xs light-text-muted">Narx</p>
                          <p className="text-xl font-bold text-accent">
                            {formatPrice(service.minPrice)}
                          </p>
                          {service.minPrice !== service.maxPrice && (
                            <p className="text-xs light-text-muted">
                              - {formatPrice(service.maxPrice)} so'm
                            </p>
                          )}
                        </div>
                        <Button 
                          size="sm" 
                          className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
            />
            
            {/* Modal */}
            <motion.div
              className="relative modal-base rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-auto"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-light-gray hover:opacity-80 transition-colors light-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="p-8">
                {/* Header */}
                <div className="mb-6">
                  {selectedService.popularity > 100 && (
                    <Badge className="mb-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white border-0">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Mashhur xizmat
                    </Badge>
                  )}
                  <h2 className="text-2xl font-bold light-text-primary mb-2">
                    {selectedService.name}
                  </h2>
                  <p className="light-text-muted">
                    {selectedService.description}
                  </p>
                </div>
                
                {/* Details */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between p-4 bg-light-gray rounded-xl">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-accent" />
                      <span className="light-text-secondary">Davomiyligi</span>
                    </div>
                    <span className="font-semibold light-text-primary">
                      {formatDuration(selectedService.duration)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-light-gray rounded-xl">
                    <div className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-accent" />
                      <span className="light-text-secondary">Mashhurlik</span>
                    </div>
                    <span className="font-semibold light-text-primary">
                      {selectedService.popularity}+ bron
                    </span>
                  </div>
                </div>
                
                {/* Price */}
                <div className="p-6 price-box rounded-2xl mb-6">
                  <p className="text-sm light-text-muted mb-1">Narx oralig'i</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-accent">
                      {formatPrice(selectedService.minPrice)}
                    </span>
                    <span className="light-text-muted">-</span>
                    <span className="text-xl font-semibold light-text-secondary">
                      {formatPrice(selectedService.maxPrice)} so'm
                    </span>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-3">
                  <Link href={`/masters?category=${selectedService.category}`} className="flex-1">
                    <Button className="w-full rounded-xl py-6">
                      <Sparkles className="w-5 h-5 mr-2" />
                      Stilist tanlash
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="rounded-xl py-6"
                    onClick={() => setSelectedService(null)}
                  >
                    Yopish
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
