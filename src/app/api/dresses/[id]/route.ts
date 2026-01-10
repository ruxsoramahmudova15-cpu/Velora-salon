import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const dress = await db.weddingDress.findUnique({
      where: { id }
    })
    
    if (!dress) {
      return NextResponse.json(
        { message: 'Ko\'ylak topilmadi' },
        { status: 404 }
      )
    }

    // Get booked dates for this dress
    const bookedDates = await db.dressAvailability.findMany({
      where: { dressId: id, isBlocked: true }
    })

    // Generate availability for next 60 days
    const availability: { date: string; isAvailable: boolean }[] = []
    const today = new Date()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const blockedDates = bookedDates.map((b: any) => b.date.toISOString().split('T')[0])
    
    for (let i = 0; i < 60; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]
      
      availability.push({
        date: dateStr,
        isAvailable: !blockedDates.includes(dateStr) && dress.isAvailable,
      })
    }

    return NextResponse.json({
      dress,
      availability,
      depositPercent: 30,
    })
  } catch (error) {
    console.error('Error fetching dress:', error)
    return NextResponse.json(
      { message: 'Serverda xatolik yuz berdi' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const dress = await db.weddingDress.update({
      where: { id },
      data: body
    })

    return NextResponse.json({ dress, success: true })
  } catch (error) {
    console.error('Error updating dress:', error)
    return NextResponse.json(
      { message: 'Serverda xatolik yuz berdi' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    await db.weddingDress.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting dress:', error)
    return NextResponse.json(
      { message: 'Serverda xatolik yuz berdi' },
      { status: 500 }
    )
  }
}
