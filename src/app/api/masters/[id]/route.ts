import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const master = await prisma.master.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            phone: true
          }
        },
        services: {
          where: { isActive: true },
          include: {
            service: {
              select: {
                id: true,
                name: true,
                description: true,
                duration: true,
                category: true
              }
            }
          }
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            client: {
              select: {
                name: true,
                avatar: true
              }
            }
          }
        },
        portfolio: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!master) {
      return NextResponse.json({ error: 'Stilist topilmadi' }, { status: 404 })
    }

    return NextResponse.json(master)
  } catch (error) {
    console.error('Get master error:', error)
    return NextResponse.json({ error: 'Xatolik yuz berdi' }, { status: 500 })
  }
}
