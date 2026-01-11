import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    console.log('🌱 Seeding database...')

    // Clear existing data - use transaction for safety
    await db.$transaction([
      db.message.deleteMany(),
      db.conversation.deleteMany(),
      db.dressAvailability.deleteMany(),
      db.weddingDressRental.deleteMany(),
      db.weddingDress.deleteMany(),
      db.activityLog.deleteMany(),
      db.reminder.deleteMany(),
      db.portfolioImage.deleteMany(),
      db.verificationCode.deleteMany(),
      db.emptySlotPromo.deleteMany(),
      db.promotionService.deleteMany(),
      db.promotion.deleteMany(),
      db.favoriteMaster.deleteMany(),
      db.serviceHistory.deleteMany(),
      db.bonusTransaction.deleteMany(),
      db.earning.deleteMany(),
      db.review.deleteMany(),
      db.appointment.deleteMany(),
      db.blockedDate.deleteMany(),
      db.schedule.deleteMany(),
      db.masterService.deleteMany(),
      db.master.deleteMany(),
      db.service.deleteMany(),
      db.user.deleteMany(),
    ])

    // Create services
    const services = await Promise.all([
      db.service.create({
        data: { name: 'Soch kesish', description: 'Professional soch kesish xizmati', category: 'SOCH', basePrice: 80000, minPrice: 50000, maxPrice: 150000, duration: 45 },
      }),
      db.service.create({
        data: { name: "Soch bo'yash", description: "Sifatli bo'yoqlar bilan soch bo'yash", category: 'SOCH', basePrice: 200000, minPrice: 150000, maxPrice: 500000, duration: 120 },
      }),
      db.service.create({
        data: { name: 'Ukladka', description: 'Chiroyli soch ukladkasi', category: 'SOCH', basePrice: 100000, minPrice: 70000, maxPrice: 200000, duration: 60 },
      }),
      db.service.create({
        data: { name: 'Manikyur', description: 'Klassik manikyur', category: 'TIRNOQ', basePrice: 60000, minPrice: 40000, maxPrice: 100000, duration: 60 },
      }),
      db.service.create({
        data: { name: 'Pedikyur', description: 'Professional pedikyur', category: 'TIRNOQ', basePrice: 80000, minPrice: 50000, maxPrice: 150000, duration: 90 },
      }),
      db.service.create({
        data: { name: 'Gel lak', description: 'Gel lak qoplama', category: 'TIRNOQ', basePrice: 100000, minPrice: 70000, maxPrice: 180000, duration: 90 },
      }),
      db.service.create({
        data: { name: 'Qosh shakllantirish', description: 'Qosh dizayni va shakllantirish', category: 'QOSH', basePrice: 50000, minPrice: 30000, maxPrice: 100000, duration: 30 },
      }),
      db.service.create({
        data: { name: 'Qosh laminatsiya', description: 'Qosh laminatsiyasi', category: 'QOSH', basePrice: 150000, minPrice: 100000, maxPrice: 250000, duration: 60 },
      }),
      db.service.create({
        data: { name: 'Kiprik uzaytirish', description: "Sun'iy kiprik uzaytirish", category: 'QOSH', basePrice: 200000, minPrice: 150000, maxPrice: 400000, duration: 120 },
      }),
      db.service.create({
        data: { name: 'Kundalik makiyaj', description: 'Yengil kundalik makiyaj', category: 'MAKIYAJ', basePrice: 150000, minPrice: 100000, maxPrice: 250000, duration: 60 },
      }),
      db.service.create({
        data: { name: "To'y makiyaji", description: 'Kelin uchun maxsus makiyaj', category: 'MAKIYAJ', basePrice: 500000, minPrice: 300000, maxPrice: 1000000, duration: 120 },
      }),
    ])

    // Create Admin user
    await db.user.create({
      data: { phone: '+998900000000', name: 'Admin Velora', role: 'ADMIN', isFirstLogin: false },
    })

    // Create masters
    const mastersData = [
      { name: 'Malika Umarova', phone: '+998901111111', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face', bio: '10 yillik tajribaga ega professional soch ustasi.', experienceYears: 10, specialization: 'SOCH', averageRating: 4.9, totalReviews: 128 },
      { name: 'Nilufar Karimova', phone: '+998902222222', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face', bio: 'Nail art va gel lak mutaxassisi.', experienceYears: 7, specialization: 'TIRNOQ', averageRating: 4.8, totalReviews: 95 },
      { name: 'Zarina Rahimova', phone: '+998903333333', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face', bio: 'Qosh va kiprik ustasi.', experienceYears: 5, specialization: 'QOSH', averageRating: 4.7, totalReviews: 67 },
      { name: 'Madina Azimova', phone: '+998904444444', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face', bio: 'Professional vizajist.', experienceYears: 8, specialization: 'MAKIYAJ', averageRating: 4.9, totalReviews: 156 },
    ]

    for (const masterData of mastersData) {
      const user = await db.user.create({
        data: { phone: masterData.phone, name: masterData.name, avatar: masterData.avatar, role: 'MASTER', isFirstLogin: false },
      })

      const master = await db.master.create({
        data: {
          userId: user.id,
          uniqueCode: `M${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          bio: masterData.bio,
          experienceYears: masterData.experienceYears,
          specialization: masterData.specialization,
          isAvailable: true,
          averageRating: masterData.averageRating,
          totalReviews: masterData.totalReviews,
        },
      })

      const categoryServices = services.filter(s => s.category === masterData.specialization)
      for (const service of categoryServices) {
        await db.masterService.create({
          data: { masterId: master.id, serviceId: service.id, price: service.basePrice + Math.floor(Math.random() * 50000) },
        })
      }

      for (let day = 1; day <= 6; day++) {
        await db.schedule.create({
          data: { masterId: master.id, dayOfWeek: day, startTime: '09:00', endTime: '18:00', lunchStart: '13:00', lunchEnd: '14:00', isWorking: true },
        })
      }
    }


    // Create wedding dresses
    const weddingDresses = [
      { name: 'Malika Premium', description: "Nafis to'r va gipur bilan bezatilgan klassik kelin ko'ylagi.", price: 5000000, rentPrice: 800000, image: '/dresses/dress1.jpg', size: 'M', color: 'Oq', style: 'CLASSIC', timesRented: 12 },
      { name: 'Shahzoda A-Line', description: 'A-shaklidagi zamonaviy dizayn.', price: 4500000, rentPrice: 700000, image: '/dresses/dress2.jpg', size: 'S', color: 'Krem', style: 'A_LINE', timesRented: 8 },
      { name: 'Princess Dream', description: "Shaxzoda uslubidagi hashamatli ko'ylak.", price: 7000000, rentPrice: 1200000, image: '/dresses/dress3.jpg', size: 'M', color: 'Oq', style: 'PRINCESS', timesRented: 15 },
      { name: 'Mermaid Elegance', description: "Baliq dumli elegant ko'ylak.", price: 6000000, rentPrice: 1000000, image: '/dresses/dress4.jpg', size: 'S', color: 'Oq', style: 'MERMAID', timesRented: 10 },
    ]

    for (const dress of weddingDresses) {
      await db.weddingDress.create({ data: dress })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Database seeded successfully!',
      data: {
        services: services.length,
        masters: mastersData.length,
        dresses: weddingDresses.length
      }
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
