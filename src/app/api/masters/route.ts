import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const sortBy = searchParams.get('sortBy') || 'rating'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = {
      isAvailable: true,
      user: {
        isActive: true,
      },
    }

    if (category && category !== 'ALL') {
      where.specialization = category
    }

    let orderBy: any = {}
    switch (sortBy) {
      case 'rating':
        orderBy = { averageRating: 'desc' }
        break
      case 'price':
        orderBy = { services: { _count: 'asc' } }
        break
      case 'available':
        orderBy = { isAvailable: 'desc' }
        break
      default:
        orderBy = { averageRating: 'desc' }
    }

    const masters = await db.master.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
          },
        },
        services: {
          where: { isActive: true },
          include: {
            service: {
              select: {
                name: true,
              },
            },
          },
          orderBy: { price: 'asc' },
          take: 1,
        },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    })

    const total = await db.master.count({ where })

    return NextResponse.json({
      masters,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching masters:', error)
    return NextResponse.json(
      { message: 'Serverda xatolik yuz berdi' },
      { status: 500 }
    )
  }
}
