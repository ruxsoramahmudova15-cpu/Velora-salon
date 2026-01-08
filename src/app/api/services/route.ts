import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Xizmatlar ro'yxati
const mockServices = [
  // SOCH xizmatlari
  {
    id: '1',
    name: 'Soch kesish',
    description: 'Professional soch kesish xizmati. Har qanday uslubda.',
    category: 'SOCH',
    basePrice: 50000,
    minPrice: 40000,
    maxPrice: 150000,
    duration: 30,
    isActive: true,
    popularity: 156,
  },
  {
    id: '2',
    name: 'Soch bo\'yash',
    description: 'Sifatli bo\'yoqlar bilan soch bo\'yash. Ombre, balayaj, highlights.',
    category: 'SOCH',
    basePrice: 200000,
    minPrice: 150000,
    maxPrice: 500000,
    duration: 120,
    isActive: true,
    popularity: 89,
  },
  {
    id: '3',
    name: 'Ukladka',
    description: 'Bayram va kundalik ukladkalar. Lokonda, to\'lqinli, tekis.',
    category: 'SOCH',
    basePrice: 80000,
    minPrice: 60000,
    maxPrice: 200000,
    duration: 45,
    isActive: true,
    popularity: 124,
  },
  {
    id: '4',
    name: 'Soch davolash',
    description: 'Keratin, botoks, laminirovka. Sochni tiklash va parvarish.',
    category: 'SOCH',
    basePrice: 300000,
    minPrice: 200000,
    maxPrice: 800000,
    duration: 90,
    isActive: true,
    popularity: 67,
  },
  {
    id: '5',
    name: 'To\'y soch turmaklash',
    description: 'Kelin uchun maxsus soch turmagi. Bezaklar bilan.',
    category: 'SOCH',
    basePrice: 400000,
    minPrice: 300000,
    maxPrice: 1000000,
    duration: 120,
    isActive: true,
    popularity: 45,
  },
  // TIRNOQ xizmatlari
  {
    id: '6',
    name: 'Klassik manikyur',
    description: 'Tirnoq shakllantirish, kutikula parvarishi, lak.',
    category: 'TIRNOQ',
    basePrice: 60000,
    minPrice: 40000,
    maxPrice: 100000,
    duration: 45,
    isActive: true,
    popularity: 198,
  },
  {
    id: '7',
    name: 'Gel lak',
    description: '2-3 hafta davom etadigan gel lak qoplama.',
    category: 'TIRNOQ',
    basePrice: 100000,
    minPrice: 80000,
    maxPrice: 180000,
    duration: 60,
    isActive: true,
    popularity: 234,
  },
  {
    id: '8',
    name: 'Nail art dizayn',
    description: 'Tirnoqqa chizish, straz, folga, stamping.',
    category: 'TIRNOQ',
    basePrice: 150000,
    minPrice: 100000,
    maxPrice: 300000,
    duration: 90,
    isActive: true,
    popularity: 112,
  },
  {
    id: '9',
    name: 'Pedikyur',
    description: 'Oyoq tirnoqlari parvarishi. Klassik va apparat.',
    category: 'TIRNOQ',
    basePrice: 80000,
    minPrice: 60000,
    maxPrice: 150000,
    duration: 60,
    isActive: true,
    popularity: 87,
  },
  {
    id: '10',
    name: 'Tirnoq uzaytirish',
    description: 'Akril yoki gel bilan tirnoq uzaytirish.',
    category: 'TIRNOQ',
    basePrice: 200000,
    minPrice: 150000,
    maxPrice: 400000,
    duration: 120,
    isActive: true,
    popularity: 76,
  },
  // QOSH xizmatlari
  {
    id: '11',
    name: 'Qosh shakllantirish',
    description: 'Pinseta yoki mum bilan qosh shakllantirish.',
    category: 'QOSH',
    basePrice: 30000,
    minPrice: 20000,
    maxPrice: 60000,
    duration: 20,
    isActive: true,
    popularity: 167,
  },
  {
    id: '12',
    name: 'Qosh laminatsiya',
    description: 'Qoshlarni tekislash va shakl berish. 6-8 hafta davom etadi.',
    category: 'QOSH',
    basePrice: 150000,
    minPrice: 100000,
    maxPrice: 250000,
    duration: 45,
    isActive: true,
    popularity: 134,
  },
  {
    id: '13',
    name: 'Qosh bo\'yash',
    description: 'Xna yoki bo\'yoq bilan qosh bo\'yash.',
    category: 'QOSH',
    basePrice: 50000,
    minPrice: 30000,
    maxPrice: 100000,
    duration: 30,
    isActive: true,
    popularity: 145,
  },
  {
    id: '14',
    name: 'Kiprik uzaytirish',
    description: '2D, 3D, Hollywood effekt. Sun\'iy kipriklar.',
    category: 'QOSH',
    basePrice: 200000,
    minPrice: 150000,
    maxPrice: 400000,
    duration: 90,
    isActive: true,
    popularity: 189,
  },
  {
    id: '15',
    name: 'Kiprik laminatsiya',
    description: 'Kipriklarni buklash va bo\'yash. 4-6 hafta davom etadi.',
    category: 'QOSH',
    basePrice: 120000,
    minPrice: 80000,
    maxPrice: 200000,
    duration: 60,
    isActive: true,
    popularity: 156,
  },
  // MAKIYAJ xizmatlari
  {
    id: '16',
    name: 'Kundalik makiyaj',
    description: 'Yengil, tabiiy ko\'rinish uchun makiyaj.',
    category: 'MAKIYAJ',
    basePrice: 100000,
    minPrice: 80000,
    maxPrice: 200000,
    duration: 45,
    isActive: true,
    popularity: 98,
  },
  {
    id: '17',
    name: 'Kechki makiyaj',
    description: 'Bayram va tadbirlar uchun yorqin makiyaj.',
    category: 'MAKIYAJ',
    basePrice: 150000,
    minPrice: 120000,
    maxPrice: 300000,
    duration: 60,
    isActive: true,
    popularity: 112,
  },
  {
    id: '18',
    name: 'To\'y makiyaji',
    description: 'Kelin uchun professional makiyaj. Uzoq davom etadi.',
    category: 'MAKIYAJ',
    basePrice: 400000,
    minPrice: 300000,
    maxPrice: 800000,
    duration: 90,
    isActive: true,
    popularity: 67,
  },
  {
    id: '19',
    name: 'Makiyaj darsi',
    description: 'O\'zingiz makiyaj qilishni o\'rganing. Individual dars.',
    category: 'MAKIYAJ',
    basePrice: 200000,
    minPrice: 150000,
    maxPrice: 400000,
    duration: 120,
    isActive: true,
    popularity: 34,
  },
  {
    id: '20',
    name: 'Fotosessiya makiyaji',
    description: 'Fotosurat uchun maxsus makiyaj. Kamera uchun optimallashtirilgan.',
    category: 'MAKIYAJ',
    basePrice: 250000,
    minPrice: 200000,
    maxPrice: 500000,
    duration: 75,
    isActive: true,
    popularity: 56,
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    let services = mockServices.filter(s => s.isActive)

    // Kategoriya bo'yicha filtrlash
    if (category && category !== 'ALL') {
      services = services.filter(s => s.category === category)
    }

    // Mashhurlik bo'yicha tartiblash
    services.sort((a, b) => b.popularity - a.popularity)

    // Kategoriyalar statistikasi
    const categories = [
      {
        id: 'SOCH',
        name: 'Soch xizmatlari',
        icon: 'scissors',
        description: 'Soch kesish, bo\'yash, davolash, ukladka',
        serviceCount: mockServices.filter(s => s.category === 'SOCH' && s.isActive).length,
        color: 'rose',
      },
      {
        id: 'TIRNOQ',
        name: 'Tirnoq xizmatlari',
        icon: 'palette',
        description: 'Manikyur, pedikyur, nail art, gel lak',
        serviceCount: mockServices.filter(s => s.category === 'TIRNOQ' && s.isActive).length,
        color: 'purple',
      },
      {
        id: 'QOSH',
        name: 'Qosh va kiprik',
        icon: 'eye',
        description: 'Qosh dizayni, laminatsiya, kiprik uzaytirish',
        serviceCount: mockServices.filter(s => s.category === 'QOSH' && s.isActive).length,
        color: 'amber',
      },
      {
        id: 'MAKIYAJ',
        name: 'Makiyaj',
        icon: 'heart',
        description: 'Kundalik, bayram, to\'y makiyaji',
        serviceCount: mockServices.filter(s => s.category === 'MAKIYAJ' && s.isActive).length,
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
