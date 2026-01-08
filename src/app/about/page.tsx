'use client'

import { motion } from 'framer-motion'
import { 
  Heart, Users, Award, Target, Sparkles, Shield, 
  Clock, Star, Phone, Mail, MapPin, CheckCircle2
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
}

const values = [
  { icon: Heart, title: 'Mijozlarga g\'amxo\'rlik', description: 'Har bir mijozimiz bizning oilamiz a\'zosi' },
  { icon: Award, title: 'Sifat kafolati', description: 'Faqat professional va tasdiqlangan stilistlar' },
  { icon: Shield, title: 'Ishonchlilik', description: 'Xavfsiz to\'lov va ma\'lumotlar himoyasi' },
  { icon: Clock, title: 'Vaqtni tejash', description: '30 soniyada onlayn navbat olish imkoniyati' },
]

const stats = [
  { value: '500+', label: 'Mamnun mijozlar' },
  { value: '50+', label: 'Professional stilistlar' },
  { value: '1000+', label: 'Bajarilgan xizmatlar' },
  { value: '4.9', label: 'O\'rtacha reyting' },
]

const team = [
  { name: 'Malika Umarova', role: 'Asoschi & Direktor', image: '/team/malika.jpg' },
  { name: 'Nilufar Karimova', role: 'Bosh stilist', image: '/team/nilufar.jpg' },
  { name: 'Zarina Aliyeva', role: 'Mijozlar bilan ishlash', image: '/team/zarina.jpg' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12 bg-background">
      {/* Hero Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Badge className="mb-6 px-4 py-2">
                Biz haqimizda
              </Badge>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-bold light-text-primary mb-6">
              Go'zallik <span className="text-gradient">VELORA</span> bilan
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-xl light-text-secondary leading-relaxed">
              VELORA - O'zbekistondagi ayollar uchun birinchi aqlli go'zallik platformasi. 
              Biz sizga eng yaxshi stilistlarni topish, qulay vaqtda navbat olish va 
              o'zingizga mos xizmatni kashf etish imkoniyatini taqdim etamiz.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-section">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="mb-4 px-4 py-2">
                <Target className="w-4 h-4 mr-2" />
                Bizning maqsadimiz
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold light-text-primary mb-6">
                Har bir ayolning go'zalligini ochish
              </h2>
              <p className="light-text-secondary mb-6 leading-relaxed">
                Biz har bir ayolning o'ziga xos go'zalligini ochishga yordam beramiz. 
                VELORA platformasi orqali siz o'zingizga mos stilistni topishingiz, 
                qulay vaqtda navbat olishingiz va professional xizmatlardan bahramand bo'lishingiz mumkin.
              </p>
              <ul className="space-y-3">
                {['Professional stilistlar bilan ishlash', 'Qulay onlayn navbat tizimi', 'AI tavsiyalar tizimi', 'Bonus va chegirmalar'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 light-text-secondary">
                    <CheckCircle2 className="h-5 w-5 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="card-base rounded-3xl shadow-xl p-8 border border-subtle">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, i) => (
                    <div key={i} className="text-center p-4">
                      <p className="text-3xl md:text-4xl font-bold text-accent mb-1">{stat.value}</p>
                      <p className="text-sm light-text-muted">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Qadriyatlarimiz
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold light-text-primary mb-4">
              Nima uchun bizni tanlashadi?
            </h2>
            <p className="light-text-muted max-w-2xl mx-auto">
              Biz mijozlarimizga eng yaxshi xizmatni taqdim etish uchun doimo harakat qilamiz
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 rounded-2xl icon-box-accent flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <value.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="font-semibold light-text-primary mb-2">{value.title}</h3>
                    <p className="text-sm light-text-muted">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-section">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 px-4 py-2">
              <Users className="w-4 h-4 mr-2" />
              Bizning jamoa
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold light-text-primary mb-4">
              Professional jamoamiz
            </h2>
            <p className="light-text-muted max-w-2xl mx-auto">
              Tajribali va mehribon jamoamiz sizga xizmat ko'rsatishdan mamnun
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="border-0 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="aspect-square bg-light-gray flex items-center justify-center">
                    <span className="text-6xl font-bold light-text-muted">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold text-lg light-text-primary mb-1">{member.name}</h3>
                    <p className="text-sm light-text-muted">{member.role}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 px-4 py-2">
                Bog'lanish
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold light-text-primary mb-4">
                Biz bilan bog'laning
              </h2>
              <p className="light-text-muted">
                Savollaringiz bormi? Biz bilan bog'laning!
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-3 gap-6 mb-12">
              {[
                { icon: Phone, label: 'Telefon', value: '+998 91 083 22 55', href: 'tel:+998910832255' },
                { icon: Mail, label: 'Email', value: 'info@velora.uz', href: 'mailto:info@velora.uz' },
                { icon: MapPin, label: 'Manzil', value: 'Toshkent, O\'zbekiston', href: '#' },
              ].map((contact, i) => (
                <motion.a
                  key={i}
                  href={contact.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="block"
                >
                  <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 rounded-xl bg-light-gray flex items-center justify-center mx-auto mb-4">
                        <contact.icon className="h-6 w-6 text-accent" />
                      </div>
                      <p className="text-sm light-text-muted mb-1">{contact.label}</p>
                      <p className="font-semibold light-text-primary">{contact.value}</p>
                    </CardContent>
                  </Card>
                </motion.a>
              ))}
            </div>

            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Link href="/register">
                <Button size="lg" className="rounded-2xl px-10 py-6 shadow-lg">
                  <Star className="mr-2 h-5 w-5" />
                  Hoziroq boshlang
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
