'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Send, Phone, MoreVertical, Check, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { useAuthStore } from '@/store/auth-store'
import Link from 'next/link'

interface Message {
  id: string
  conversationId: string
  senderId: string
  senderType: string
  content: string
  isRead: boolean
  createdAt: string
}

interface ChatData {
  conversation: {
    id: string
    clientId: string
    masterId: string
  }
  messages: Message[]
  master: {
    id: string
    user: { name: string; avatar: string | null; phone: string }
  }
  client: {
    id: string
    name: string
    avatar: string | null
    phone: string
  }
}

export default function ChatPage() {
  const router = useRouter()
  const params = useParams()
  const conversationId = params.conversationId as string
  const { user, isAuthenticated } = useAuthStore()
  
  const [chatData, setChatData] = useState<ChatData | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    fetchMessages()
    
    // Har 3 soniyada yangi xabarlarni tekshirish
    const interval = setInterval(fetchMessages, 3000)
    return () => clearInterval(interval)
  }, [isAuthenticated, conversationId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchMessages = async () => {
    if (!user) return
    
    try {
      const userType = user.role === 'MASTER' ? 'MASTER' : 'CLIENT'
      const res = await fetch(`/api/chat/${conversationId}?userId=${user.id}&userType=${userType}`)
      const data = await res.json()
      
      if (data.error) {
        router.push('/chat')
        return
      }
      
      setChatData(data)
      setMessages(data.messages)
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user || sending) return

    setSending(true)
    const userType = user.role === 'MASTER' ? 'MASTER' : 'CLIENT'

    try {
      const res = await fetch(`/api/chat/${conversationId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: user.id,
          senderType: userType,
          content: newMessage.trim()
        })
      })

      if (res.ok) {
        const message = await res.json()
        setMessages(prev => [...prev, message])
        setNewMessage('')
        inputRef.current?.focus()
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('uz-UZ', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Bugun'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Kecha'
    } else {
      return date.toLocaleDateString('uz-UZ', { 
        day: 'numeric', 
        month: 'long',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      })
    }
  }

  // Xabarlarni kunlarga bo'lish
  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { date: string; messages: Message[] }[] = []
    let currentDate = ''

    messages.forEach(msg => {
      const msgDate = new Date(msg.createdAt).toDateString()
      if (msgDate !== currentDate) {
        currentDate = msgDate
        groups.push({ date: msg.createdAt, messages: [msg] })
      } else {
        groups[groups.length - 1].messages.push(msg)
      }
    })

    return groups
  }

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const otherUser = user?.role === 'MASTER' ? chatData?.client : chatData?.master?.user
  const otherName = otherUser?.name || 'Foydalanuvchi'
  const messageGroups = groupMessagesByDate(messages)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-lg border-b border-subtle">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/chat">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <Avatar 
                src={otherUser?.avatar || undefined} 
                fallback={otherName.charAt(0)} 
                size="md" 
              />
              <div>
                <h2 className="font-medium light-text-primary">{otherName}</h2>
                <p className="text-xs light-text-muted">
                  {user?.role === 'MASTER' ? 'Mijoz' : 'Stilist'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {otherUser?.phone && (
                <a href={`tel:${otherUser.phone}`}>
                  <Button variant="ghost" size="icon">
                    <Phone className="h-5 w-5" />
                  </Button>
                </a>
              )}
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {messageGroups.length === 0 ? (
            <div className="text-center py-10">
              <p className="light-text-muted">Suhbatni boshlang!</p>
            </div>
          ) : (
            messageGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                {/* Date separator */}
                <div className="flex items-center justify-center mb-4">
                  <span className="px-3 py-1 bg-light-gray rounded-full text-xs light-text-muted">
                    {formatDate(group.date)}
                  </span>
                </div>

                {/* Messages */}
                <div className="space-y-2">
                  {group.messages.map((msg, msgIndex) => {
                    const isOwn = msg.senderId === user?.id
                    const showAvatar = !isOwn && (
                      msgIndex === 0 || 
                      group.messages[msgIndex - 1]?.senderId !== msg.senderId
                    )

                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-end gap-2 max-w-[80%] ${isOwn ? 'flex-row-reverse' : ''}`}>
                          {!isOwn && showAvatar && (
                            <Avatar 
                              src={otherUser?.avatar || undefined} 
                              fallback={otherName.charAt(0)} 
                              size="sm" 
                            />
                          )}
                          {!isOwn && !showAvatar && <div className="w-8" />}
                          
                          <div
                            className={`px-4 py-2 rounded-2xl ${
                              isOwn
                                ? 'bg-accent text-white rounded-br-md'
                                : 'bg-light-gray light-text-primary rounded-bl-md'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                            <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : ''}`}>
                              <span className={`text-[10px] ${isOwn ? 'text-white/70' : 'light-text-muted'}`}>
                                {formatTime(msg.createdAt)}
                              </span>
                              {isOwn && (
                                msg.isRead 
                                  ? <CheckCheck className="h-3 w-3 text-white/70" />
                                  : <Check className="h-3 w-3 text-white/70" />
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur-lg border-t border-subtle">
        <div className="container mx-auto px-4 py-3">
          <form onSubmit={sendMessage} className="max-w-2xl mx-auto flex items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Xabar yozing..."
              className="flex-1 px-4 py-3 rounded-full input-field"
              disabled={sending}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="rounded-full w-12 h-12 shrink-0"
              disabled={!newMessage.trim() || sending}
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
