import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const date = searchParams.get('date')

    const where: Record<string, unknown> = {}
    
    if (status && status !== 'all') {
      where.status = status
    }
    
    if (date) {
      const startDate = new Date(date)
      startDate.setHours(0, 0, 0, 0)
      const endDate = new Date(date)
      endDate.setHours(23, 59, 59, 999)
      where.date = {
        gte: startDate,
        lte: endDate
      }
    }

    const appointments = await db.appointment.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            phone: true,
            avatar: true
          }
        },
        master: {
          include: {
            user: {
              select: {
                name: true,
                phone: true,
                avatar: true
              }
            }
          }
        }
      },
      orderBy: [
        { date: 'desc' },
        { startTime: 'desc' }
      ]
    })

    // Get service names
    const serviceIds = [...new Set(appointments.map(a => a.serviceId))]
    const services = await db.service.findMany({
      where: { id: { in: serviceIds } },
      select: { id: true, name: true }
    })
    const serviceMap = new Map(services.map(s => [s.id, s.name]))

    const formattedAppointments = appointments.map(apt => ({
      id: apt.id,
      date: apt.date,
      startTime: apt.startTime,
      endTime: apt.endTime,
      status: apt.status,
      finalPrice: apt.finalPrice,
      originalPrice: apt.originalPrice,
      discountAmount: apt.discountAmount,
      serviceName: serviceMap.get(apt.serviceId) || 'Noma\'lum xizmat',
      client: {
        id: apt.client.id,
        name: apt.client.name || 'Noma\'lum',
        phone: apt.client.phone,
        avatar: apt.client.avatar
      },
      master: {
        id: apt.master.id,
        name: apt.master.user.name || 'Noma\'lum',
        phone: apt.master.user.phone,
        avatar: apt.master.user.avatar,
        specialization: apt.master.specialization
      },
      createdAt: apt.createdAt
    }))

    // Statistics
    const stats = {
      total: appointments.length,
      pending: appointments.filter(a => a.status === 'PENDING').length,
      confirmed: appointments.filter(a => a.status === 'CONFIRMED').length,
      completed: appointments.filter(a => a.status === 'COMPLETED').length,
      cancelled: appointments.filter(a => a.status === 'CANCELLED').length
    }

    return NextResponse.json({ 
      success: true, 
      data: formattedAppointments,
      stats 
    })
  } catch (error) {
    console.error('Admin bookings error:', error)
    return NextResponse.json(
      { success: false, error: 'Navbatlarni yuklashda xatolik' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'ID va status kerak' },
        { status: 400 }
      )
    }

    const appointment = await db.appointment.update({
      where: { id },
      data: { status }
    })

    return NextResponse.json({ success: true, data: appointment })
  } catch (error) {
    console.error('Update booking error:', error)
    return NextResponse.json(
      { success: false, error: 'Navbatni yangilashda xatolik' },
      { status: 500 }
    )
  }
}
