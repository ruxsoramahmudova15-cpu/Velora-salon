'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { MessageCircle, Search, ArrowLeft, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/store/auth-store'
import Link from 'next/link'

interface Conversation {
  id: string
  clientId: string
  masterId: string
  lastMessageAt: string
  messages: { content: string; createdAt: string }[]
  master?: {
    id: string
    user: { name: string; avatar: string | null; phone: string }
  }
  client?: {
    id: string
    name: string
    avatar: string | null
    phone: string
  }
  unreadCount: number
}

export default function ChatListPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    fetchConversations()
  }, [isAuthenticated, user])

  const fetchConversations = async () => {
    if (!user) return
    
    try {
      const userType = user.role === 'MASTER' ? 'MASTER' : 'CLIENT'
      const res = await fetch(`/api/chat?userId=${user.id}&userType=${userType}`)
      const data = await res.json()
      setConversations(data)
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredConversations = conversations.filter(conv => {
    const name = user?.role === 'MASTER' 
      ? conv.client?.name 
      : conv.master?.user?.name
    return name?.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) {
      return date.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
    } else if (days === 1) {
      return 'Kecha'
    } else if (days < 7) {
      return date.toLocaleDateString('uz-UZ', { weekday: 'short' })
    } else {
      return date.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' })
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-lg border-b border-subtle">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="font-serif text-2xl light-text-primary">Xabarlar</h1>
              <p className="text-sm light-text-muted">
                {user?.role === 'MASTER' ? 'Mijozlar bilan suhbatlar' : 'Stilistlar bilan suhbatlar'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 light-text-muted" />
          <input
            type="text"
            placeholder="Qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl input-field"
          />
        </div>

        {/* Conversations List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredConversations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
              <MessageCircle className="h-10 w-10 text-accent" />
            </div>
            <h3 className="font-serif text-xl light-text-primary mb-2">Hali suhbatlar yo'q</h3>
            <p className="light-text-muted mb-6">
              {user?.role === 'MASTER' 
                ? 'Mijozlar sizga xabar yuborganda bu yerda ko\'rinadi'
                : 'Stilistlar sahifasidan suhbat boshlang'}
            </p>
            {user?.role !== 'MASTER' && (
              <Link href="/masters">
                <Button>Stilistlarni ko'rish</Button>
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="space-y-2">
            {filteredConversations.map((conv, index) => {
              const otherUser = user?.role === 'MASTER' ? conv.client : conv.master?.user
              const name = otherUser?.name || 'Foydalanuvchi'
              const lastMessage = conv.messages[0]?.content || 'Yangi suhbat'

              return (
                <motion.div
                  key={conv.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/chat/${conv.id}`}>
                    <div className="card-purple-glow p-4 cursor-pointer hover-elevation">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Avatar 
                            src={otherUser?.avatar || undefined} 
                            fallback={name.charAt(0)} 
                            size="lg" 
                          />
                          {conv.unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-xs rounded-full flex items-center justify-center font-medium">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium light-text-primary truncate">{name}</h3>
                            <span className="text-xs light-text-muted">
                              {formatTime(conv.lastMessageAt)}
                            </span>
                          </div>
                          <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'light-text-primary font-medium' : 'light-text-muted'}`}>
                            {lastMessage}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
