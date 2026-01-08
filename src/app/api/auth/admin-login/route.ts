import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'velora-secret-key-change-in-production'

// Admin credentials (in production, store hashed password in database)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    
    console.log('Login attempt:', { username, password })
    console.log('Expected:', { ADMIN_USERNAME, ADMIN_PASSWORD })

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { message: 'Login va parol kerak' },
        { status: 400 }
      )
    }

    // Check credentials - case insensitive for username
    if (username.toLowerCase() !== ADMIN_USERNAME.toLowerCase() || password !== ADMIN_PASSWORD) {
      console.log('Credentials mismatch')
      return NextResponse.json(
        { message: 'Login yoki parol noto\'g\'ri' },
        { status: 401 }
      )
    }

    // Find or create admin user
    let adminUser = await db.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (!adminUser) {
      adminUser = await db.user.create({
        data: {
          phone: '+998900000000',
          name: 'Admin Velora',
          role: 'ADMIN',
          isFirstLogin: false,
        }
      })
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: adminUser.id, role: 'ADMIN' },
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
        id: adminUser.id,
        phone: adminUser.phone,
        name: adminUser.name,
        avatar: adminUser.avatar,
        role: adminUser.role,
        bonusBalance: adminUser.bonusBalance,
      },
    })
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { message: 'Serverda xatolik yuz berdi' },
      { status: 500 }
    )
  }
}
