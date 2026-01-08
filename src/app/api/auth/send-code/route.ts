import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateCode } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const { phone, isRegister } = await request.json()

    // Validate phone format
    if (!phone || !/^\+998\d{9}$/.test(phone)) {
      return NextResponse.json(
        { message: 'Telefon raqam noto\'g\'ri formatda' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { phone },
    })

    if (isRegister && existingUser) {
      return NextResponse.json(
        { message: 'Bu raqam allaqachon ro\'yxatdan o\'tgan' },
        { status: 400 }
      )
    }

    if (!isRegister && !existingUser) {
      return NextResponse.json(
        { message: 'Bu raqam ro\'yxatdan o\'tmagan' },
        { status: 400 }
      )
    }

    // Check for existing verification code and rate limiting
    const existingCode = await db.verificationCode.findFirst({
      where: { phone },
      orderBy: { createdAt: 'desc' },
    })

    if (existingCode?.blockedUntil && existingCode.blockedUntil > new Date()) {
      const remainingMinutes = Math.ceil(
        (existingCode.blockedUntil.getTime() - Date.now()) / 60000
      )
      return NextResponse.json(
        { message: `Juda ko'p urinish. ${remainingMinutes} daqiqadan keyin qayta urinib ko'ring` },
        { status: 429 }
      )
    }

    // Generate new code
    const code = generateCode()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

    // Delete old codes for this phone
    await db.verificationCode.deleteMany({
      where: { phone },
    })

    // Create new verification code
    await db.verificationCode.create({
      data: {
        phone,
        code,
        expiresAt,
      },
    })

    // TODO: Send SMS via Eskiz.uz API
    // For development, log the code
    console.log(`[DEV] Verification code for ${phone}: ${code}`)

    return NextResponse.json({
      success: true,
      message: 'Tasdiqlash kodi yuborildi',
      // Only include code in development
      ...(process.env.NODE_ENV === 'development' && { code }),
    })
  } catch (error) {
    console.error('Send code error:', error)
    return NextResponse.json(
      { message: 'Serverda xatolik yuz berdi' },
      { status: 500 }
    )
  }
}
