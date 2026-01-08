import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Suhbat xabarlarini olish
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const { conversationId } = await params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const userType = searchParams.get('userType')

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' }
    })

    // O'qilmagan xabarlarni o'qilgan deb belgilash
    if (userId && userType) {
      const oppositeType = userType === 'CLIENT' ? 'MASTER' : 'CLIENT'
      await prisma.message.updateMany({
        where: {
          conversationId,
          senderType: oppositeType,
          isRead: false
        },
        data: { isRead: true }
      })
    }

    // Suhbat ma'lumotlarini olish
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId }
    })

    if (!conversation) {
      return NextResponse.json({ error: 'Suhbat topilmadi' }, { status: 404 })
    }

    // Master va client ma'lumotlari
    const master = await prisma.master.findUnique({
      where: { id: conversation.masterId },
      include: { user: { select: { name: true, avatar: true, phone: true } } }
    })

    const client = await prisma.user.findUnique({
      where: { id: conversation.clientId },
      select: { id: true, name: true, avatar: true, phone: true }
    })

    return NextResponse.json({
      conversation,
      messages,
      master,
      client
    })
  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json({ error: 'Xatolik yuz berdi' }, { status: 500 })
  }
}

// Yangi xabar yuborish
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const { conversationId } = await params
    const body = await request.json()
    const { senderId, senderType, content } = body

    if (!senderId || !senderType || !content) {
      return NextResponse.json({ error: 'Barcha maydonlar kerak' }, { status: 400 })
    }

    // Xabar yaratish
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId,
        senderType,
        content
      }
    })

    // Suhbat vaqtini yangilash
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() }
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json({ error: 'Xatolik yuz berdi' }, { status: 500 })
  }
}
