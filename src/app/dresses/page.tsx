'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Heart, Crown, Sparkles, Star, ShoppingBag } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loading } from '@/components/ui/loading'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const styles = [
  { id: 'ALL', name: 'Barchasi', icon: Sparkles },
  { id: 'CLASSIC', name: 'Klassik', icon: Crown },
  { id: 'MODERN', name: 'Zamonaviy', icon: Star },
  { id: 'PRINCESS', name: 'Shaxzoda', icon: Crown },
  { id: 'MERMAID', name: 'Baliq dumi', icon: Sparkles },
  { id: 'A_LINE', name: 'A-shakl', icon: Star },
]

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

interface WeddingDress {
  id: string
  name: string
  description: string | null
  price: number
  rentPrice: number
  image: string
  size: string
  color: string
  style: string
  timesRented: number
  isAvailable: boolean
}

export default function DressesPage() {
  const [dresses, setDresses] = useState<WeddingDress[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('ALL')
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    fetchDresses()
  }, [selectedStyle, selectedSize])

  const fetchDresses = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedStyle !== 'ALL') params.set('style', selectedStyle)
      if (selectedSize) params.set('size', selectedSize)
      
      const response = await fetch(`/api/dresses?${params}`)
      const data = await response.json()
      setDresses(data.dresses || [])
    } catch (error) {
      console.error('Error fetching dresses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  const filteredDresses = dresses.filter(dress =>
    dress.name.toLowerCase().includes(search.toLowerCase()) ||
    dress.description?.toLowerCase().includes(search.toLowerCase())
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m'
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section - Premium Design */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-fuchsia-100 via-pink-100 to-violet-200 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-64 h-64 bg-fuchsia-300/50 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-violet-300/40 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl" />
        </div>
        
        <div className="container relative mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-rose-200 dark:border-rose-800 shadow-xl mb-8">
            <Crown className="h-5 w-5 text-rose-500" />
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Premium Kelin Ko'ylaklar Kolleksiyasi
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-gray-900 dark:text-white">Orzuingizdagi </span>
            <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Kelin Ko'ylak
            </span>
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
            Eng nafis va zamonaviy kelin ko'ylaklarni kashf eting. 
            Ijaraga oling yoki sotib oling - tanlov sizniki!
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 md:gap-16">
            <div className="text-center">
              <p className="text-3xl font-bold text-rose-500">100+</p>
              <p className="text-sm text-gray-500">Ko'ylaklar</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-rose-500">500+</p>
              <p className="text-sm text-gray-500">Mamnun kelinlar</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-rose-500">4.9</p>
              <p className="text-sm text-gray-500">Reyting</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Filters Section */}
        <div className="mb-10 space-y-6">
          {/* Search */}
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Ko'ylak nomini qidiring..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-14 text-lg rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-rose-400"
            />
          </div>

          {/* Style Tabs */}
          <div className="flex flex-wrap justify-center gap-3">
            {styles.map((style) => (
              <Button
                key={style.id}
                variant={selectedStyle === style.id ? 'default' : 'outline'}
                size="lg"
                onClick={() => setSelectedStyle(style.id)}
                className={cn(
                  "rounded-full px-6 gap-2 transition-all",
                  selectedStyle === style.id && "shadow-lg shadow-rose-200/50"
                )}
              >
                <style.icon className="h-4 w-4" />
                {style.name}
              </Button>
            ))}
          </div>

          {/* Size Filter */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-gray-500">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">O'lcham:</span>
            </div>
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                className={cn(
                  'w-10 h-10 rounded-full text-sm font-semibold transition-all',
                  selectedSize === size
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-300/50 scale-110'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Dresses Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loading size="lg" />
          </div>
        ) : filteredDresses.length === 0 ? (
          <div className="py-20 text-center">
            <Crown className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">Ko'ylaklar topilmadi</p>
            <p className="text-gray-400 mt-2">Boshqa filtrlarni sinab ko'ring</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredDresses.map((dress) => (
              <Link key={dress.id} href={`/dresses/${dress.id}`}>
                <Card className="group h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white dark:bg-gray-800 rounded-3xl">
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={dress.image}
                      alt={dress.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    
                    {/* Favorite Button */}
                    <button
                      onClick={(e) => toggleFavorite(e, dress.id)}
                      className={cn(
                        "absolute top-4 right-4 p-3 rounded-full transition-all duration-300",
                        "bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-lg",
                        "hover:scale-110 active:scale-95",
                        favorites.includes(dress.id) && "bg-rose-500 dark:bg-rose-500"
                      )}
                    >
                      <Heart 
                        className={cn(
                          'h-5 w-5 transition-colors',
                          favorites.includes(dress.id) 
                            ? 'fill-white text-white' 
                            : 'text-gray-600 dark:text-gray-300'
                        )} 
                      />
                    </button>

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {dress.timesRented > 10 && (
                        <Badge className="bg-gradient-to-r from-rose-500 to-pink-500 text-white border-0 shadow-lg">
                          🔥 Mashhur
                        </Badge>
                      )}
                      {dress.timesRented === 0 && (
                        <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-lg">
                          ✨ Yangi
                        </Badge>
                      )}
                    </div>

                    {/* Bottom Info on Image */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                      <h3 className="font-bold text-xl mb-1 drop-shadow-lg">
                        {dress.name}
                      </h3>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                          {dress.size}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                          {dress.color}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                          {dress.timesRented}x
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <CardContent className="p-5">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                      {dress.description}
                    </p>

                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Ijara narxi</p>
                        <p className="text-xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                          {formatPrice(dress.rentPrice)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400 mb-1">Sotib olish</p>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {formatPrice(dress.price)}
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button 
                      className="w-full mt-4 rounded-xl h-12 gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        window.location.href = `/dresses/book?id=${dress.id}`
                      }}
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Bron qilish
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            O'zingizga mos ko'ylak topa olmadingizmi?
          </h2>
          <p className="text-lg text-rose-100 mb-8 max-w-2xl mx-auto">
            Bizga qo'ng'iroq qiling yoki yozing - sizga individual maslahat beramiz
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-rose-600 hover:bg-rose-50 rounded-full px-8">
              +998 91 083 22 55
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 rounded-full px-8">
              Telegram orqali yozish
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
