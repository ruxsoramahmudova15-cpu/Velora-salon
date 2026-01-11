import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { isActive: true }
    
    if (category && category !== 'ALL') {
      where.category = category
    }

    const services = await db.service.findMany({
      where,
      orderBy: { name: 'asc' }
    })

    // Kategoriyalar statistikasi
    const allServices = await db.service.findMany({ where: { isActive: true } })
    
    const categories = [
      {
        id: 'SOCH',
        name: 'Soch xizmatlari',
        icon: 'scissors',
        description: 'Soch kesish, bo\'yash, davolash, ukladka',
        serviceCount: allServices.filter((s: { category: string }) => s.category === 'SOCH').length,
        color: 'rose',
      },
      {
        id: 'TIRNOQ',
        name: 'Tirnoq xizmatlari',
        icon: 'palette',
        description: 'Manikyur, pedikyur, nail art, gel lak',
        serviceCount: allServices.filter((s: { category: string }) => s.category === 'TIRNOQ').length,
        color: 'purple',
      },
      {
        id: 'QOSH',
        name: 'Qosh va kiprik',
        icon: 'eye',
        description: 'Qosh dizayni, laminatsiya, kiprik uzaytirish',
        serviceCount: allServices.filter((s: { category: string }) => s.category === 'QOSH').length,
        color: 'amber',
      },
      {
        id: 'MAKIYAJ',
        name: 'Makiyaj',
        icon: 'heart',
        description: 'Kundalik, bayram, to\'y makiyaji',
        serviceCount: allServices.filter((s: { category: string }) => s.category === 'MAKIYAJ').length,
        color: 'pink',
      },
    ]

    return NextResponse.json({
      services,
      categories,
      total: services.length,
    })
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { message: 'Serverda xatolik yuz berdi' },
      { status: 500 }
    )
  }
}
