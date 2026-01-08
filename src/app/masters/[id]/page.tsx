'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Star, Clock, Calendar, MessageCircle, Phone, 
  MapPin, Award, Scissors, Heart, Share2, CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Rating } from '@/components/ui/rating'
import { Card, CardContent } from '@/components/ui/card'
import { useAuthStore } from '@/store/auth-store'
import Link from 'next/link'

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
    id: string
    name: string | null
    avatar: string | null
    phone: string
  }
  services: {
    id: string
    price: number
    service: {
      id: string
      name: string
      description: string | null
      duration: number
      category: string
    }
  }[]
  reviews: {
    id: string
    rating: number
    comment: string | null
    createdAt: string
    client: {
      name: string | null
      avatar: string | null
    }
  }[]
}

export default function MasterDetailPage() {
  const params = useParams()
  const router = useRouter()
  const masterId = params.id as string
  const { user, isAuthenticated } = useAuthStore()
  
  const [master, setMaster] = useState<Master | null>(null)
  const [loading, setLoading] = useState(true)
  const [startingChat, setStartingChat] = useState(false)

  useEffect(() => {
    fetchMaster()
  }, [masterId])

  const fetchMaster = async () => {
    try {
      const res = await fetch(`/api/masters/${masterId}`)
      if (res.ok) {
        const data = await res.json()
        setMaster(data)
      }
    } catch (error) {
      console.error('Error fetching master:', error)
    } finally {
      setLoading(false)
    }
  }

  const startChat = async () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (!user || !master) return

    setStartingChat(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: user.id,
          masterId: master.id
        })
      })

      if (res.ok) {
        const conversation = await res.json()
        router.push(`/chat/${conversation.id}`)
      }
    } catch (error) {
      console.error('Error starting chat:', error)
    } finally {
      setStartingChat(false)
    }
  }

  const getCategoryLabel = (spec: string) => {
    const labels: Record<string, string> = {
      SOCH: 'Soch stilisti',
      TIRNOQ: 'Tirnoq stilisti',
      QOSH: 'Qosh stilisti',
      MAKIYAJ: 'Makiyajchi',
    }
    return labels[spec] || spec
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!master) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium light-text-primary mb-2">Stilist topilmadi</h2>
          <Link href="/masters">
            <Button>Orqaga qaytish</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-lg border-b border-subtle">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/masters">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="font-serif text-xl light-text-primary">Stilist profili</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-purple-glow p-8 mb-8"
          >
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="relative">
                <Avatar 
                  src={master.user.avatar || undefined} 
                  fallback={master.user.name?.charAt(0) || 'S'} 
                  size="xl"
                  className="w-32 h-32"
                />
                {master.isAvailable && (
                  <span className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-4 border-white dark:border-[#141414]" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h2 className="font-serif text-2xl light-text-primary mb-1">
                      {master.user.name || 'Stilist'}
                    </h2>
                    <p className="text-accent font-medium">{getCategoryLabel(master.specialization)}</p>
                  </div>
                  {master.isAvailable && (
                    <Badge variant="success">Bo'sh</Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Rating value={master.averageRating} size="sm" />
                    <span className="text-sm light-text-muted">({master.totalReviews} sharh)</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm light-text-muted">
                    <Award className="h-4 w-4" />
                    {master.experienceYears} yil tajriba
                  </div>
                </div>

                {master.bio && (
                  <p className="light-text-secondary mb-6">{master.bio}</p>
                )}

                <div className="flex flex-wrap gap-3">
                  <Link href={`/booking?master=${master.id}`}>
                    <Button className="gap-2">
                      <Calendar className="h-4 w-4" />
                      Navbat olish
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="gap-2"
                    onClick={startChat}
                    disabled={startingChat}
                  >
                    <MessageCircle className="h-4 w-4" />
                    {startingChat ? 'Yuklanmoqda...' : 'Xabar yuborish'}
                  </Button>
                  <a href={`tel:${master.user.phone}`}>
                    <Button variant="outline" className="gap-2">
                      <Phone className="h-4 w-4" />
                      Qo'ng'iroq
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h3 className="font-serif text-xl light-text-primary mb-4">Xizmatlar</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {master.services.map((ms) => (
                <Card key={ms.id} className="hover-elevation">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium light-text-primary mb-1">{ms.service.name}</h4>
                        {ms.service.description && (
                          <p className="text-sm light-text-muted mb-2">{ms.service.description}</p>
                        )}
                        <div className="flex items-center gap-2 text-sm light-text-muted">
                          <Clock className="h-4 w-4" />
                          {ms.service.duration} daqiqa
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-accent">{ms.price.toLocaleString()} so'm</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Reviews */}
          {master.reviews.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="font-serif text-xl light-text-primary mb-4">Sharhlar</h3>
              <div className="space-y-4">
                {master.reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Avatar 
                          src={review.client.avatar || undefined} 
                          fallback={review.client.name?.charAt(0) || 'M'} 
                          size="md" 
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium light-text-primary">
                              {review.client.name || 'Mijoz'}
                            </h4>
                            <span className="text-xs light-text-muted">
                              {new Date(review.createdAt).toLocaleDateString('uz-UZ')}
                            </span>
                          </div>
                          <Rating value={review.rating} size="sm" />
                          {review.comment && (
                            <p className="mt-2 text-sm light-text-secondary">{review.comment}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
