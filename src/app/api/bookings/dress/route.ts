import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Deposit hisoblash funksiyasi - 30%
export function calculateDeposit(rentPrice: number): number {
  return Math.round(rentPrice * 0.3)
}

// Refund hisoblash funksiyasi
export function calculateRefund(depositAmount: number, daysUntilRental: number): number {
  // 7+ kun oldin bekor qilsa - 90% refund
  // 7 kundan kam - 0% refund
  if (daysUntilRental >= 7) {
    return Math.round(depositAmount * 0.9)
  }
  return 0
}

// Sanalar orasidagi kunlar sonini hisoblash
export function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000
  return Math.round(Math.abs((date2.getTime() - date1.getTime()) / oneDay))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { dressId, startDate, endDate, userId } = body

    // Validate input
    if (!dressId || !startDate || !endDate) {
      return NextResponse.json(
        { message: 'Barcha maydonlarni to\'ldiring' },
        { status: 400 }
      )
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    const today = new Date()

    // Validate dates
    if (start < today) {
      return NextResponse.json(
        { message: 'O\'tgan sanani tanlab bo\'lmaydi' },
        { status: 400 }
      )
    }

    if (end < start) {
      return NextResponse.json(
        { message: 'Tugash sanasi boshlanish sanasidan keyin bo\'lishi kerak' },
        { status: 400 }
      )
    }

    // Check dress availability
    const dress = await db.weddingDress.findUnique({
      where: { id: dressId },
    })

    if (!dress) {
      return NextResponse.json(
        { message: 'Ko\'ylak topilmadi' },
        { status: 404 }
      )
    }

    if (!dress.isAvailable) {
      return NextResponse.json(
        { message: 'Bu ko\'ylak hozirda mavjud emas' },
        { status: 400 }
      )
    }

    // Check for existing bookings in date range
    const existingBookings = await db.weddingDressRental.findMany({
      where: {
        dressId,
        status: { in: ['PENDING', 'CONFIRMED', 'ACTIVE'] },
        OR: [
          {
            startDate: { lte: end },
            endDate: { gte: start },
          },
        ],
      },
    })

    if (existingBookings.length > 0) {
      return NextResponse.json(
        { message: 'Bu sanalar band. Boshqa sanalarni tanlang.' },
        { status: 409 }
      )
    }

    // Calculate prices
    const rentalDays = daysBetween(start, end) + 1
    const totalPrice = dress.rentPrice * rentalDays
    const depositAmount = calculateDeposit(totalPrice)

    // Create booking
    const booking = await db.weddingDressRental.create({
      data: {
        dressId,
        clientId: userId || 'guest', // For now, allow guest bookings
        startDate: start,
        endDate: end,
        totalPrice,
        depositAmount,
        status: 'PENDING',
      },
    })

    // Log activity
    await db.activityLog.create({
      data: {
        type: 'DRESS_BOOKING',
        message: `Yangi ko'ylak bron: ${dress.name}`,
        userId: userId || null,
        metadata: JSON.stringify({
          bookingId: booking.id,
          dressId,
          startDate,
          endDate,
          totalPrice,
          depositAmount,
        }),
      },
    })

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        dressId: booking.dressId,
        startDate: booking.startDate,
        endDate: booking.endDate,
        totalPrice: booking.totalPrice,
        depositAmount: booking.depositAmount,
        status: booking.status,
      },
      message: 'Bron muvaffaqiyatli yaratildi!',
    })
  } catch (error) {
    console.error('Error creating dress booking:', error)
    return NextResponse.json(
      { message: 'Serverda xatolik yuz berdi' },
      { status: 500 }
    )
  }
}

// Cancel booking
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get('id')

    if (!bookingId) {
      return NextResponse.json(
        { message: 'Bron ID kerak' },
        { status: 400 }
      )
    }

    const booking = await db.weddingDressRental.findUnique({
      where: { id: bookingId },
      include: { dress: true },
    })

    if (!booking) {
      return NextResponse.json(
        { message: 'Bron topilmadi' },
        { status: 404 }
      )
    }

    if (booking.status === 'CANCELLED') {
      return NextResponse.json(
        { message: 'Bu bron allaqachon bekor qilingan' },
        { status: 400 }
      )
    }

    // Calculate refund
    const today = new Date()
    const daysUntilRental = daysBetween(today, booking.startDate)
    const refundAmount = calculateRefund(booking.depositAmount, daysUntilRental)

    // Update booking
    await db.weddingDressRental.update({
      where: { id: bookingId },
      data: {
        status: 'CANCELLED',
        refundAmount,
      },
    })

    // Log activity
    await db.activityLog.create({
      data: {
        type: 'CANCELLATION',
        message: `Ko'ylak bron bekor qilindi: ${booking.dress.name}`,
        userId: booking.clientId,
        metadata: JSON.stringify({
          bookingId,
          refundAmount,
          daysUntilRental,
        }),
      },
    })

    return NextResponse.json({
      success: true,
      refundAmount,
      message: refundAmount > 0 
        ? `Bron bekor qilindi. Qaytariladi: ${refundAmount.toLocaleString()} so'm`
        : 'Bron bekor qilindi. Depozit qaytarilmaydi (7 kundan kam qolgan).',
    })
  } catch (error) {
    console.error('Error cancelling booking:', error)
    return NextResponse.json(
      { message: 'Serverda xatolik yuz berdi' },
      { status: 500 }
    )
  }
}
