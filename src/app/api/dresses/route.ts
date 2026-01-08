import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const style = searchParams.get('style')
    const size = searchParams.get('size')
    const all = searchParams.get('all') // for admin to see all

    const where: Record<string, unknown> = {}
    
    if (!all) {
      where.isAvailable = true
    }
    
    if (style) {
      where.style = style
    }
    
    if (size) {
      where.size = size
    }

    const dresses = await db.weddingDress.findMany({
      where,
      orderBy: { timesRented: 'desc' }
    })

    return NextResponse.json({ dresses })
  } catch (error) {
    console.error('Error fetching dresses:', error)
    return NextResponse.json(
      { message: 'Serverda xatolik yuz berdi' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const dress = await db.weddingDress.create({
      data: {
        name: body.name,
        description: body.description || null,
        price: body.price,
        rentPrice: body.rentPrice,
        image: body.image || '/dresses/download.jpg',
        size: body.size || 'M',
        color: body.color || 'Oq',
        style: body.style || 'CLASSIC',
        isAvailable: true,
        timesRented: 0
      }
    })

    return NextResponse.json({ dress, success: true })
  } catch (error) {
    console.error('Error creating dress:', error)
    return NextResponse.json(
      { message: 'Serverda xatolik yuz berdi' },
      { status: 500 }
    )
  }
}
