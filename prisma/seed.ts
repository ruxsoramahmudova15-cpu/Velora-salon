import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.weddingDressRental.deleteMany()
  await prisma.weddingDress.deleteMany()
  await prisma.masterService.deleteMany()
  await prisma.schedule.deleteMany()
  await prisma.master.deleteMany()
  await prisma.service.deleteMany()
  await prisma.user.deleteMany()

  // Create services
  const services = await Promise.all([
    // Soch xizmatlari
    prisma.service.create({
      data: {
        name: 'Soch kesish',
        description: 'Professional soch kesish xizmati',
        category: 'SOCH',
        basePrice: 80000,
        minPrice: 50000,
        maxPrice: 150000,
        duration: 45,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Soch bo\'yash',
        description: 'Sifatli bo\'yoqlar bilan soch bo\'yash',
        category: 'SOCH',
        basePrice: 200000,
        minPrice: 150000,
        maxPrice: 500000,
        duration: 120,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Ukladka',
        description: 'Chiroyli soch ukladkasi',
        category: 'SOCH',
        basePrice: 100000,
        minPrice: 70000,
        maxPrice: 200000,
        duration: 60,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Soch davolash',
        description: 'Keratin, botoks va boshqa davolash',
        category: 'SOCH',
        basePrice: 300000,
        minPrice: 200000,
        maxPrice: 800000,
        duration: 180,
      },
    }),
    // Tirnoq xizmatlari
    prisma.service.create({
      data: {
        name: 'Manikyur',
        description: 'Klassik manikyur',
        category: 'TIRNOQ',
        basePrice: 60000,
        minPrice: 40000,
        maxPrice: 100000,
        duration: 60,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Pedikyur',
        description: 'Professional pedikyur',
        category: 'TIRNOQ',
        basePrice: 80000,
        minPrice: 50000,
        maxPrice: 150000,
        duration: 90,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Gel lak',
        description: 'Gel lak qoplama',
        category: 'TIRNOQ',
        basePrice: 100000,
        minPrice: 70000,
        maxPrice: 180000,
        duration: 90,
      },
    }),
    // Qosh xizmatlari
    prisma.service.create({
      data: {
        name: 'Qosh shakllantirish',
        description: 'Qosh dizayni va shakllantirish',
        category: 'QOSH',
        basePrice: 50000,
        minPrice: 30000,
        maxPrice: 100000,
        duration: 30,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Qosh laminatsiya',
        description: 'Qosh laminatsiyasi',
        category: 'QOSH',
        basePrice: 150000,
        minPrice: 100000,
        maxPrice: 250000,
        duration: 60,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Kiprik uzaytirish',
        description: 'Sun\'iy kiprik uzaytirish',
        category: 'QOSH',
        basePrice: 200000,
        minPrice: 150000,
        maxPrice: 400000,
        duration: 120,
      },
    }),
    // Makiyaj xizmatlari
    prisma.service.create({
      data: {
        name: 'Kundalik makiyaj',
        description: 'Yengil kundalik makiyaj',
        category: 'MAKIYAJ',
        basePrice: 150000,
        minPrice: 100000,
        maxPrice: 250000,
        duration: 60,
      },
    }),
    prisma.service.create({
      data: {
        name: 'To\'y makiyaji',
        description: 'Kelin uchun maxsus makiyaj',
        category: 'MAKIYAJ',
        basePrice: 500000,
        minPrice: 300000,
        maxPrice: 1000000,
        duration: 120,
      },
    }),
  ])

  console.log(`✅ Created ${services.length} services`)

  // Create Admin user
  const adminUser = await prisma.user.create({
    data: {
      phone: '+998900000000',
      name: 'Admin Velora',
      role: 'ADMIN',
      isFirstLogin: false,
    },
  })
  console.log(`✅ Created admin user: ${adminUser.phone}`)

  // Create masters with users
  const mastersData = [
    {
      name: 'Malika Umarova',
      phone: '+998901111111',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
      bio: '10 yillik tajribaga ega professional soch ustasi. Zamonaviy uslublar va ranglar bo\'yicha mutaxassis.',
      experienceYears: 10,
      specialization: 'SOCH',
      averageRating: 4.9,
      totalReviews: 128,
    },
    {
      name: 'Nilufar Karimova',
      phone: '+998902222222',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
      bio: 'Nail art va gel lak bo\'yicha mutaxassis. Har bir mijozga individual yondashuv.',
      experienceYears: 7,
      specialization: 'TIRNOQ',
      averageRating: 4.8,
      totalReviews: 95,
    },
    {
      name: 'Zarina Rahimova',
      phone: '+998903333333',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
      bio: 'Qosh va kiprik ustasi. Laminatsiya va uzaytirish bo\'yicha sertifikatlangan.',
      experienceYears: 5,
      specialization: 'QOSH',
      averageRating: 4.7,
      totalReviews: 67,
    },
    {
      name: 'Madina Azimova',
      phone: '+998904444444',
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face',
      bio: 'Professional vizajist. To\'y va bayram makiyajlari bo\'yicha mutaxassis.',
      experienceYears: 8,
      specialization: 'MAKIYAJ',
      averageRating: 4.9,
      totalReviews: 156,
    },
    {
      name: 'Sevara Tosheva',
      phone: '+998905555555',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
      bio: 'Soch kesish va ukladka ustasi. Zamonaviy texnikalar bilan ishlaydi.',
      experienceYears: 6,
      specialization: 'SOCH',
      averageRating: 4.6,
      totalReviews: 82,
    },
    {
      name: 'Dilnoza Qodirova',
      phone: '+998906666666',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face',
      bio: 'Manikyur va pedikyur mutaxassisi. Sterillik va sifatga alohida e\'tibor.',
      experienceYears: 4,
      specialization: 'TIRNOQ',
      averageRating: 4.8,
      totalReviews: 54,
    },
    {
      name: 'Gulnora Saidova',
      phone: '+998907777777',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop&crop=face',
      bio: 'Soch bo\'yash va davolash bo\'yicha mutaxassis. Premium brendlar bilan ishlaydi.',
      experienceYears: 12,
      specialization: 'SOCH',
      averageRating: 5.0,
      totalReviews: 203,
    },
    {
      name: 'Shahzoda Mirzayeva',
      phone: '+998908888888',
      avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&h=200&fit=crop&crop=face',
      bio: 'Kelin makiyaji bo\'yicha eng yaxshi mutaxassis. 500+ to\'yda ishlagan.',
      experienceYears: 9,
      specialization: 'MAKIYAJ',
      averageRating: 4.9,
      totalReviews: 178,
    },
  ]

  for (const masterData of mastersData) {
    const user = await prisma.user.create({
      data: {
        phone: masterData.phone,
        name: masterData.name,
        avatar: masterData.avatar,
        role: 'MASTER',
        isFirstLogin: false,
      },
    })

    const master = await prisma.master.create({
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

    // Add services to master
    const categoryServices = services.filter(s => s.category === masterData.specialization)
    for (const service of categoryServices) {
      await prisma.masterService.create({
        data: {
          masterId: master.id,
          serviceId: service.id,
          price: service.basePrice + Math.floor(Math.random() * 50000),
        },
      })
    }

    // Add schedule
    for (let day = 1; day <= 6; day++) {
      await prisma.schedule.create({
        data: {
          masterId: master.id,
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '18:00',
          lunchStart: '13:00',
          lunchEnd: '14:00',
          isWorking: true,
        },
      })
    }
  }

  console.log(`✅ Created ${mastersData.length} masters`)

  // Print master login credentials
  console.log('\n📋 MASTER LOGIN MA\'LUMOTLARI:')
  console.log('================================')
  mastersData.forEach((m, i) => {
    console.log(`${i + 1}. ${m.name}`)
    console.log(`   Telefon: ${m.phone}`)
    console.log(`   Mutaxassislik: ${m.specialization}`)
    console.log('')
  })
  console.log('================================')
  console.log('Kirish uchun: Telefon raqamini kiriting va SMS kodni tasdiqlang')
  console.log('')


  // Create wedding dresses
  const weddingDresses = [
    {
      name: 'Malika Premium',
      description: 'Nafis to\'r va gipur bilan bezatilgan klassik kelin ko\'ylagi. Uzun shleyf va yopiq yelkalar.',
      price: 5000000,
      rentPrice: 800000,
      image: '/dresses/download.jpg',
      size: 'M',
      color: 'Oq',
      style: 'CLASSIC',
      timesRented: 12,
    },
    {
      name: 'Shahzoda A-Line',
      description: 'A-shaklidagi zamonaviy dizayn. Yengil mato va chiroyli kashtalar.',
      price: 4500000,
      rentPrice: 700000,
      image: '/dresses/download (1).jpg',
      size: 'S',
      color: 'Krem',
      style: 'A_LINE',
      timesRented: 8,
    },
    {
      name: 'Princess Dream',
      description: 'Shaxzoda uslubidagi hashamatli ko\'ylak. Katta yubka va kristallar bilan bezatilgan.',
      price: 7000000,
      rentPrice: 1200000,
      image: '/dresses/download (2).jpg',
      size: 'M',
      color: 'Oq',
      style: 'PRINCESS',
      timesRented: 15,
    },
    {
      name: 'Mermaid Elegance',
      description: 'Baliq dumli elegant ko\'ylak. Tanaga yopishgan va pastda kengaygan.',
      price: 6000000,
      rentPrice: 1000000,
      image: '/dresses/download (3).jpg',
      size: 'S',
      color: 'Oq',
      style: 'MERMAID',
      timesRented: 10,
    },
    {
      name: 'Modern Minimalist',
      description: 'Zamonaviy minimalist dizayn. Sodda lekin nafis ko\'rinish.',
      price: 3500000,
      rentPrice: 500000,
      image: '/dresses/download (4).jpg',
      size: 'L',
      color: 'Oq',
      style: 'MODERN',
      timesRented: 6,
    },
    {
      name: 'Royal Lace',
      description: 'Qirollik uslubidagi to\'liq to\'r ko\'ylak. Uzun yenglar va tugmalar.',
      price: 8000000,
      rentPrice: 1500000,
      image: '/dresses/download (5).jpg',
      size: 'M',
      color: 'Oq',
      style: 'CLASSIC',
      timesRented: 20,
    },
    {
      name: 'Bohemian Beauty',
      description: 'Boho uslubidagi yengil va romantik ko\'ylak. Ochiq orqa va gul naqshlari.',
      price: 4000000,
      rentPrice: 600000,
      image: '/dresses/images.jpg',
      size: 'S',
      color: 'Krem',
      style: 'MODERN',
      timesRented: 9,
    },
    {
      name: 'Glamour Gold',
      description: 'Oltin rangdagi bezaklar bilan hashamatli ko\'ylak. Maxsus tadbirlar uchun.',
      price: 9000000,
      rentPrice: 1800000,
      image: '/dresses/images (1).jpg',
      size: 'M',
      color: 'Oltin',
      style: 'PRINCESS',
      timesRented: 5,
    },
    {
      name: 'Elegant White',
      description: 'Oq rangli nafis kelin ko\'ylagi. Zamonaviy dizayn.',
      price: 5500000,
      rentPrice: 900000,
      image: '/dresses/images (2).jpg',
      size: 'M',
      color: 'Oq',
      style: 'CLASSIC',
      timesRented: 7,
    },
  ]

  for (const dress of weddingDresses) {
    await prisma.weddingDress.create({
      data: dress,
    })
  }

  console.log(`✅ Created ${weddingDresses.length} wedding dresses`)

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
