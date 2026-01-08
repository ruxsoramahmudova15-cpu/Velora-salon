import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'velora-secret-key-change-in-production'

export async function POST(request: NextRequest) {
  try {
    const { phone, code, name, role } = await request.json()

    // Validate input
    if (!phone || !code) {
      return NextResponse.json(
        { message: 'Telefon raqam va kod kerak' },
        { status: 400 }
      )
    }

    // Validate role
    const validRoles = ['CLIENT', 'MASTER']
    const userRole = validRoles.includes(role) ? role : 'CLIENT'

    // Find verification code
    const verificationCode = await db.verificationCode.findFirst({
      where: { phone },
      orderBy: { createdAt: 'desc' },
    })

    if (!verificationCode) {
      return NextResponse.json(
        { message: 'Tasdiqlash kodi topilmadi' },
        { status: 400 }
      )
    }

    // Check if blocked
    if (verificationCode.blockedUntil && verificationCode.blockedUntil > new Date()) {
      return NextResponse.json(
        { message: 'Juda ko\'p urinish. Keyinroq qayta urinib ko\'ring' },
        { status: 429 }
      )
    }

    // Check if expired
    if (verificationCode.expiresAt < new Date()) {
      return NextResponse.json(
        { message: 'Tasdiqlash kodi muddati o\'tgan' },
        { status: 400 }
      )
    }

    // Check code
    if (verificationCode.code !== code) {
      const newAttempts = verificationCode.attempts + 1
      
      if (newAttempts >= 3) {
        await db.verificationCode.update({
          where: { id: verificationCode.id },
          data: {
            attempts: newAttempts,
            blockedUntil: new Date(Date.now() + 15 * 60 * 1000),
          },
        })
        return NextResponse.json(
          { message: 'Juda ko\'p urinish. 15 daqiqadan keyin qayta urinib ko\'ring' },
          { status: 429 }
        )
      }

      await db.verificationCode.update({
        where: { id: verificationCode.id },
        data: { attempts: newAttempts },
      })

      return NextResponse.json(
        { message: 'Tasdiqlash kodi noto\'g\'ri' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { phone },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'Bu raqam allaqachon ro\'yxatdan o\'tgan' },
        { status: 400 }
      )
    }

    // Create new user
    const user = await db.user.create({
      data: {
        phone,
        name: name || null,
        role: userRole,
        bonusBalance: 0,
      },
    })

    // If role is MASTER, create master profile
    if (userRole === 'MASTER') {
      const uniqueCode = `M${Date.now().toString(36).toUpperCase()}`
      await db.master.create({
        data: {
          userId: user.id,
          uniqueCode,
          specialization: 'SOCH', // Default, can be changed later
          isAvailable: false,
        },
      })
    }

    // Delete verification code
    await db.verificationCode.delete({
      where: { id: verificationCode.id },
    })

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        bonusBalance: user.bonusBalance,
      },
    })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { message: 'Serverda xatolik yuz berdi' },
      { status: 500 }
    )
  }
}
