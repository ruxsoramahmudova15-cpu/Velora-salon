import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Barcha suhbatlarni olish
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const userType = searchParams.get('userType') // CLIENT or MASTER

    if (!userId || !userType) {
      return NextResponse.json({ error: 'userId va userType kerak' }, { status: 400 }) 
    }

    if (userType === 'CLIENT') {
      const conversations = await db.conversation.findMany({
        where: { clientId: userId },
        orderBy: { lastMessageAt: 'desc' },
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        }
      })

      // Master ma'lumotlarini qo'shish
      const conversationsWithMaster = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        conversations.map(async (conv: any) => {
          const master = await db.master.findUnique({
            where: { id: conv.masterId },
            include: { user: { select: { name: true, avatar: true, phone: true } } }
          })
          
          const unreadCount = await db.message.count({
            where: {
              conversationId: conv.id,
              senderType: 'MASTER',
              isRead: false
            }
          })

          return {
            ...conv,
            master,
            unreadCount
          }
        })
      )

      return NextResponse.json(conversationsWithMaster)
    } else {
      // MASTER
      const master = await db.master.findFirst({
        where: { userId }
      })

      if (!master) {
        return NextResponse.json({ error: 'Master topilmadi' }, { status: 404 })
      }

      const conversations = await db.conversation.findMany({
        where: { masterId: master.id },
        orderBy: { lastMessageAt: 'desc' },
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        }
      })

      // Client ma'lumotlarini qo'shish
      const conversationsWithClient = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        conversations.map(async (conv: any) => {
          const client = await db.user.findUnique({
            where: { id: conv.clientId },
            select: { id: true, name: true, avatar: true, phone: true }
          })

          const unreadCount = await db.message.count({
            where: {
              conversationId: conv.id,
              senderType: 'CLIENT',
              isRead: false
            }
          })

          return {
            ...conv,
            client,
            unreadCount
          }
        })
      )

      return NextResponse.json(conversationsWithClient)
    }
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({ error: 'Xatolik yuz berdi' }, { status: 500 })
  }
}

// Yangi suhbat boshlash
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clientId, masterId } = body

    if (!clientId || !masterId) {
      return NextResponse.json({ error: 'clientId va masterId kerak' }, { status: 400 })
    }

    // Mavjud suhbatni tekshirish
    let conversation = await db.conversation.findUnique({
      where: {
        clientId_masterId: { clientId, masterId }
      }
    })

    if (!conversation) {
      conversation = await db.conversation.create({
        data: { clientId, masterId }
      })
    }

    return NextResponse.json(conversation)
  } catch (error) {
    console.error('Create conversation error:', error)
    return NextResponse.json({ error: 'Xatolik yuz berdi' }, { status: 500 })
  }
}
