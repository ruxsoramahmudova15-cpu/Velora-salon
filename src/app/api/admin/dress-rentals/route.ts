import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where: Record<string, unknown> = {}
    
    if (status && status !== 'all') {
      where.status = status
    }

    const rentals = await db.weddingDressRental.findMany({
      where,
      include: {
        dress: {
          select: {
            id: true,
            name: true,
            image: true,
            size: true,
            color: true,
            rentPrice: true
          }
        },
        client: {
          select: {
            id: true,
            name: true,
            phone: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const formattedRentals = rentals.map(rental => ({
      id: rental.id,
      startDate: rental.startDate,
      endDate: rental.endDate,
      status: rental.status,
      totalPrice: rental.totalPrice,
      depositAmount: rental.depositAmount,
      depositPaid: rental.depositPaid,
      notes: rental.notes,
      dress: rental.dress,
      client: {
        id: rental.client.id,
        name: rental.client.name || 'Noma\'lum',
        phone: rental.client.phone,
        avatar: rental.client.avatar
      },
      createdAt: rental.createdAt
    }))

    // Statistics
    const stats = {
      total: rentals.length,
      pending: rentals.filter((r: { status: string }) => r.status === 'PENDING').length,
      confirmed: rentals.filter((r: { status: string }) => r.status === 'CONFIRMED').length,
      active: rentals.filter((r: { status: string }) => r.status === 'ACTIVE').length,
      returned: rentals.filter((r: { status: string }) => r.status === 'RETURNED').length,
      cancelled: rentals.filter((r: { status: string }) => r.status === 'CANCELLED').length
    }

    return NextResponse.json({ 
      success: true, 
      data: formattedRentals,
      stats 
    })
  } catch (error) {
    console.error('Admin dress rentals error:', error)
    return NextResponse.json(
      { success: false, error: 'Ko\'ylak ijaralarini yuklashda xatolik' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, depositPaid } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID kerak' },
        { status: 400 }
      )
    }

    const updateData: Record<string, unknown> = {}
    if (status) updateData.status = status
    if (typeof depositPaid === 'boolean') updateData.depositPaid = depositPaid

    const rental = await db.weddingDressRental.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ success: true, data: rental })
  } catch (error) {
    console.error('Update rental error:', error)
    return NextResponse.json(
      { success: false, error: 'Ijarani yangilashda xatolik' },
      { status: 500 }
    )
  }
}
