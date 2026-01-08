'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, Filter, Scissors, Palette, Eye, Heart } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Rating } from '@/components/ui/rating'
import { Loading, LoadingPage } from '@/components/ui/loading'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const categories = [
  { id: 'ALL', name: 'Barchasi', icon: null },
  { id: 'SOCH', name: 'Soch', icon: Scissors },
  { id: 'TIRNOQ', name: 'Tirnoq', icon: Palette },
  { id: 'QOSH', name: 'Qosh', icon: Eye },
  { id: 'MAKIYAJ', name: 'Makiyaj', icon: Heart },
]

interface Master {
  id: string
  uniqueCode: string
  bio: string | null
  experienceYears: number
  specialization: string
  isAvailable: boolean
  averageRating: number
  totalReviews: number
  user: {
    name: string | null
    avatar: string | null
  }
  services: {
    price: number
    service: {
      name: string
    }
  }[]
}

function MastersContent() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category') || 'ALL'
  
  const [masters, setMasters] = useState<Master[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(initialCategory)
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'available'>('rating')

  useEffect(() => {
    fetchMasters()
  }, [category, sortBy])

  const fetchMasters = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (category !== 'ALL') params.set('category', category)
      params.set('sortBy', sortBy)
      
      const response = await fetch(`/api/masters?${params}`)
      const data = await response.json()
      setMasters(data.masters || [])
    } catch (error) {
      console.error('Error fetching masters:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredMasters = masters.filter(master => 
    master.user.name?.toLowerCase().includes(search.toLowerCase()) ||
    master.bio?.toLowerCase().includes(search.toLowerCase())
  )

  const getCategoryLabel = (spec: string) => {
    const labels: Record<string, string> = {
      SOCH: 'Soch stilisti',
      TIRNOQ: 'Tirnoq stilisti',
      QOSH: 'Qosh stilisti',
      MAKIYAJ: 'Makiyajchi',
    }
    return labels[spec] || spec
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold light-text-primary">
          Stilistlar
        </h1>
        <p className="light-text-secondary">
          O'zingizga mos stilistni toping va navbat oling
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 light-text-muted" />
          <Input
            placeholder="Stilist qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={category === cat.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategory(cat.id)}
              className="gap-2"
            >
              {cat.icon && <cat.icon className="h-4 w-4" />}
              {cat.name}
            </Button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 light-text-muted" />
          <span className="text-sm light-text-muted">Saralash:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="rounded-lg border border-subtle bg-white dark:bg-[#1a1a1a] px-3 py-1.5 text-sm light-text-primary"
          >
            <option value="rating">Reyting bo'yicha</option>
            <option value="price">Narx bo'yicha</option>
            <option value="available">Bo'sh vaqt</option>
          </select>
        </div>
      </div>

      {/* Masters Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loading size="lg" />
        </div>
      ) : filteredMasters.length === 0 ? (
        <div className="py-12 text-center">
          <p className="light-text-muted">Stilistlar topilmadi</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredMasters.map((master) => (
            <Link key={master.id} href={`/masters/${master.id}`}>
              <Card className="group h-full cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <Avatar
                      src={master.user.avatar}
                      alt={master.user.name || ''}
                      fallback={master.user.name?.charAt(0)}
                      size="lg"
                    />
                    {master.isAvailable && (
                      <Badge variant="success" className="text-xs">
                        Bo'sh
                      </Badge>
                    )}
                  </div>
                  
                  <h3 className="mb-1 font-semibold light-text-primary">
                    {master.user.name || 'Stilist'}
                  </h3>
                  
                  <p className="mb-2 text-sm text-accent">
                    {getCategoryLabel(master.specialization)}
                  </p>
                  
                  <div className="mb-3 flex items-center gap-2">
                    <Rating value={master.averageRating} size="sm" />
                    <span className="text-xs light-text-muted">
                      ({master.totalReviews})
                    </span>
                  </div>
                  
                  {master.bio && (
                    <p className="mb-3 line-clamp-2 text-sm light-text-muted">
                      {master.bio}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="light-text-muted">
                      {master.experienceYears} yil tajriba
                    </span>
                    {master.services[0] && (
                      <span className="font-medium light-text-primary">
                        {master.services[0].price.toLocaleString()} so'm dan
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function MastersPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <MastersContent />
    </Suspense>
  )
}
