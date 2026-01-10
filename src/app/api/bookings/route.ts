import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { serviceId, masterId, date, startTime, endTime, clientPhone, clientName } = body

    // Find or create client
    let client = await db.user.findUnique({
      where: { phone: clientPhone }
    })

    if (!client) {
      client = await db.user.create({
        data: {
          phone: clientPhone,
          name: clientName,
          role: 'CLIENT'
        }
      })
    } else if (clientName && !client.name) {
      client = await db.user.update({
        where: { id: client.id },
        data: { name: clientName }
      })
    }

    // Get service price
    const service = await db.service.findUnique({
      where: { id: serviceId }
    })

    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Xizmat topilmadi' },
        { status: 404 }
      )
    }

    // Create appointment
    const appointment = await db.appointment.create({
      data: {
        clientId: client.id,
        masterId,
        serviceId,
        date: new Date(date),
        startTime,
        endTime,
        status: 'PENDING',
        originalPrice: service.basePrice,
        finalPrice: service.basePrice
      }
    })

    return NextResponse.json({ 
      success: true, 
      data: appointment,
      message: 'Navbat muvaffaqiyatli yaratildi'
    })
  } catch (error) {
    console.error('Create booking error:', error)
    return NextResponse.json(
      { success: false, error: 'Navbat yaratishda xatolik' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('clientId')

    if (!clientId) {
      return NextResponse.json(
        { success: false, error: 'Client ID kerak' },
        { status: 400 }
      )
    }

    const appointments = await db.appointment.findMany({
      where: { clientId },
      include: {
        master: {
          include: {
            user: {
              select: { name: true, avatar: true }
            }
          }
        }
      },
      orderBy: { date: 'desc' }
    })

    // Get service names
    const serviceIds = [...new Set(appointments.map(a => a.serviceId))]
    const services = await db.service.findMany({
      where: { id: { in: serviceIds } },
      select: { id: true, name: true }
    })
    const serviceMap = new Map(services.map(s => [s.id, s.name]))

    const formattedAppointments = appointments.map(apt => ({
      ...apt,
      serviceName: serviceMap.get(apt.serviceId) || 'Noma\'lum xizmat',
      masterName: apt.master.user.name,
      masterAvatar: apt.master.user.avatar
    }))

    return NextResponse.json({ success: true, data: formattedAppointments })
  } catch (error) {
    console.error('Get bookings error:', error)
    return NextResponse.json(
      { success: false, error: 'Navbatlarni yuklashda xatolik' },
      { status: 500 }
    )
  }
}
