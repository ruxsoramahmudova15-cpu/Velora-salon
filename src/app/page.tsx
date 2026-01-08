'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { 
  Sparkles, Clock, Shield, Scissors, Palette, Eye, Heart,
  ChevronRight, Play, CheckCircle2,
  ArrowRight, Phone, Zap, Crown, Gift
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Rating } from '@/components/ui/rating'
import { cn } from '@/lib/utils'

const categories = [
  { name: 'Soch xizmatlari', icon: Scissors, description: 'Soch kesish, boyash, davolash', href: '/services?category=SOCH', count: '50+', image: '/services/soch.jpg' },
  { name: 'Tirnoq xizmatlari', icon: Palette, description: 'Manikyur, pedikyur, nail art', href: '/services?category=TIRNOQ', count: '30+', image: '/services/tirnoq.jpg' },
  { name: 'Qosh va kiprik', icon: Eye, description: 'Qosh dizayni, kiprik uzaytirish', href: '/services?category=QOSH', count: '25+', image: '/services/qosh.jpg' },
  { name: 'Makiyaj', icon: Heart, description: 'Kundalik, bayram, toʻy makiyaji', href: '/services?category=MAKIYAJ', count: '20+', image: '/services/makiyaj.jpg' },
]

const stats = [
  { value: '500+', label: 'Mamnun mijozlar' },
  { value: '50+', label: 'Professional stilistlar' },
  { value: '1000+', label: 'Bajarilgan xizmatlar' },
  { value: '4.9', label: 'O\'rtacha reyting' },
]

const features = [
  { icon: Sparkles, title: 'AI tavsiyalar', description: 'Sizga mos xizmatni topamiz' },
  { icon: Clock, title: 'Tezkor navbat', description: '30 soniyada navbat oling' },
  { icon: Zap, title: 'Chegirmalar', description: '50% gacha chegirma' },
  { icon: Shield, title: 'Ishonchli', description: 'Tasdiqlangan stilistlar' },
]

const testimonials = [
  { name: 'Madina A.', role: 'Doimiy mijoz', rating: 5, text: 'VELORA orqali navbat olish juda qulay! Endi kutish shart emas.' },
  { name: 'Nilufar S.', role: 'Doimiy mijoz', rating: 5, text: 'Eng yaxshi stilistlarni topdim. Juda foydali platforma!' },
  { name: 'Zarina K.', role: 'Yangi mijoz', rating: 5, text: 'Birinchi marta foydalandim va juda mamnunman.' },
]

// Animation variants - Optimized for performance
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
}

// Card animation - simplified
const cardAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      delay: i * 0.08
    }
  })
}

function AnimatedSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div ref={ref} initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={staggerContainer} className={className}>
      {children}
    </motion.div>
  )
}

export default function HomePage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length), 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col overflow-hidden bg-background">
      {/* Hero Section - Luxury Minimalist */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Static background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div className="space-y-8" initial="hidden" animate="visible" variants={staggerContainer}>
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 px-5 py-2.5 border border-accent/20 bg-white/80 dark:bg-background/80 backdrop-blur-sm rounded-full shadow-luxury">
                <span className="flex h-2.5 w-2.5 rounded-full bg-accent" />
                <span className="text-sm font-sans light-text-secondary">O'zbekistonda #1 go'zallik platformasi</span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-serif text-5xl md:text-6xl lg:text-7xl tracking-tight leading-tight">
                <span className="light-text-primary">Go'zallik</span>
                <br />
                <span className="text-gradient glow-text">VELORA</span>
                <br />
                <span className="light-text-primary">bilan</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-lg font-sans max-w-lg leading-relaxed light-text-secondary">
                Eng yaxshi stilistlarni toping, onlayn navbat oling va o'zingizga mos xizmatni kashf eting.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
                <Link href="/booking">
                  <Button size="lg" className="group w-full sm:w-auto text-base px-8 py-6 shadow-gold hover:shadow-[0_0_40px_rgba(197,163,88,0.4)] transition-all duration-500">
                    <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-500 animate-sparkle" />
                    Navbat olish
                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-500" />
                  </Button>
                </Link>
                <Link href="/masters">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-8 py-6 border-accent/30 hover:border-accent hover:bg-accent/5 dark:border-accent/50 dark:hover:bg-accent/10 transition-all duration-500">
                    <Play className="mr-2 h-5 w-5" />
                    Stilistlarni ko'rish
                  </Button>
                </Link>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex items-center gap-8 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-11 h-11 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 border-2 border-background dark:border-section flex items-center justify-center text-accent text-xs font-semibold shadow-lg">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold light-text-primary">500+ mijoz</p>
                  <p className="text-xs light-text-muted">bizga ishonadi</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Hero Card */}
            <motion.div className="relative hidden lg:block" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
              <div className="relative">
                {/* Main Card */}
                <div className="card-gold-border p-8 hover-elevation">
                  <div className="absolute -top-4 -right-4 px-4 py-2 bg-gradient-gold text-white text-sm font-sans rounded-full shadow-gold">
                    ✨ Premium
                  </div>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 icon-box-accent rounded-xl flex items-center justify-center shadow-gold">
                      <Scissors className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg light-text-primary">Soch kesish + Ukladka</h3>
                      <p className="text-sm font-sans light-text-muted">Premium xizmat</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-serif text-2xl light-text-primary">150,000 <span className="text-sm font-sans light-text-muted">so'm</span></p>
                        <p className="text-xs font-sans light-text-muted">45 daqiqa</p>
                      </div>
                      <Button className="shadow-gold">
                        Navbat olish
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Floating Cards - Static with Gold Border */}
                <div className="absolute -bottom-8 -left-8 card-gold-float card-gold-float-left p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium light-text-primary">Navbat tasdiqlandi!</p>
                      <p className="text-xs light-text-muted">Bugun, 14:00</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-8 -left-6 card-gold-float card-gold-float-top p-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-accent" />
                    <span className="font-serif text-lg light-text-primary">Premium</span>
                    <span className="text-sm font-sans light-text-muted">xizmat</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-section relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5" />
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div 
                key={stat.label} 
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={cardAnimation}
                className="text-center"
              >
                <p className="font-serif text-4xl md:text-5xl text-gradient glow-text mb-2">{stat.value}</p>
                <p className="text-sm font-sans light-text-secondary">{stat.label}</p>
              </motion.div>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection>
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <p className="text-accent font-sans text-sm tracking-widest uppercase mb-4">Xizmatlar</p>
              <h2 className="font-serif text-4xl md:text-5xl light-text-primary mb-4">Xizmat turlarini tanlang</h2>
              <p className="font-sans light-text-secondary max-w-2xl mx-auto">Barcha go'zallik xizmatlari bir joyda</p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, i) => (
                <motion.div 
                  key={category.name} 
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  variants={cardAnimation}
                >
                  <Link href={category.href}>
                    <div className="card-purple-glow group h-full cursor-pointer overflow-hidden hover-elevation transition-all duration-500">
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden rounded-t-[18px]">
                        <img 
                          src={category.image} 
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        <div className="absolute top-4 left-4 w-12 h-12 icon-box-accent rounded-xl flex items-center justify-center shadow-gold">
                          <category.icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      {/* Content */}
                      <div className="p-6">
                        <h3 className="font-serif text-xl light-text-primary mb-2 group-hover:text-accent transition-colors duration-500">{category.name}</h3>
                        <p className="text-sm font-sans light-text-muted mb-4">{category.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-accent">{category.count} xizmat</span>
                          <div className="w-8 h-8 icon-box-accent rounded-lg flex items-center justify-center group-hover:translate-x-1 group-hover:shadow-gold transition-all duration-500">
                            <ChevronRight className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-section relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={fadeInUp}>
              <p className="text-accent font-sans text-sm tracking-widest uppercase mb-4">Afzalliklar</p>
              <h2 className="font-serif text-4xl md:text-5xl light-text-primary mb-6">
                Nima uchun <span className="text-gradient">VELORA</span>?
              </h2>
              <p className="font-sans light-text-secondary mb-10 leading-relaxed">
                Biz oddiy navbat tizimi emas. VELORA - bu sizning go'zallik sayohatingizni osonlashtiradigan aqlli platforma.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                {features.map((feature, i) => (
                  <motion.div 
                    key={feature.title} 
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-30px' }}
                    variants={cardAnimation}
                    className="flex gap-4 group"
                  >
                    <div className="w-14 h-14 bg-white dark:bg-background/20 backdrop-blur-sm border border-subtle rounded-xl flex items-center justify-center shrink-0 group-hover:bg-gradient-to-br group-hover:from-accent group-hover:to-accent-dark group-hover:border-transparent group-hover:shadow-gold transition-all duration-500">
                      <feature.icon className="h-7 w-7 text-accent group-hover:text-white transition-colors duration-500" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg light-text-primary mb-1">{feature.title}</h3>
                      <p className="text-sm font-sans light-text-secondary">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={scaleIn} className="relative">
              <div className="card-purple-glow p-10">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 icon-box-accent rounded-2xl mb-4 shadow-gold animate-pulse-glow">
                    <Sparkles className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="font-serif text-2xl light-text-primary mb-2">Men uchun mos xizmat</h3>
                  <p className="font-sans light-text-secondary">3-4 savolga javob bering</p>
                </div>

                <div className="space-y-4 mb-8">
                  {['Soch turingiz qanday?', 'Qancha vaqtingiz bor?', 'Byudjetingiz?'].map((q, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-light-gray rounded-xl group hover:bg-accent/10 dark:hover:bg-purple-500/10 border border-transparent dark:border-white/5 dark:hover:border-purple-500/30 transition-all duration-500">
                      <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent-dark rounded-lg flex items-center justify-center text-white font-sans text-sm shadow-lg">{i + 1}</div>
                      <span className="font-sans light-text-primary">{q}</span>
                    </div>
                  ))}
                </div>

                <Link href="/recommendation">
                  <Button className="w-full py-6 shadow-gold hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] transition-all duration-500">
                    Boshlash
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* Wedding Dresses Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl -translate-y-1/2" />
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection>
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <p className="text-accent font-sans text-sm tracking-widest uppercase mb-4">
                <Crown className="w-4 h-4 inline mr-2" />
                Kelin ko'ylaklar
              </p>
              <h2 className="font-serif text-4xl md:text-5xl light-text-primary mb-4">Premium Kelin Ko'ylaklar</h2>
              <p className="font-sans light-text-secondary max-w-2xl mx-auto">Eng chiroyli va zamonaviy kelin ko'ylaklarni ijaraga oling</p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {[
                { name: 'Shaxzoda Ko\'ylak', image: '/dresses/download.jpg', price: 1800000, timesRented: 31 },
                { name: 'Baliq Dumi', image: '/dresses/download (1).jpg', price: 1400000, timesRented: 18 },
                { name: 'Qirollik Ko\'ylak', image: '/dresses/download (2).jpg', price: 2200000, timesRented: 28 },
                { name: 'Klassik A-Shakl', image: '/dresses/images.jpg', price: 750000, timesRented: 22 },
              ].map((dress, idx) => (
                <motion.div 
                  key={idx} 
                  custom={idx}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  variants={cardAnimation}
                >
                  <Link href="/dresses">
                    <div className="card-purple-glow group overflow-hidden hover-elevation img-zoom">
                      <div className="relative aspect-[3/4] overflow-hidden rounded-t-[18px]">
                        <img src={dress.image} alt={dress.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        {dress.timesRented > 20 && (
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-gradient-to-r from-accent to-accent-light text-white border-0 shadow-gold">✨ Mashhur</Badge>
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <h3 className="font-serif text-xl mb-2">{dress.name}</h3>
                          <div className="flex items-center justify-between">
                            <span className="font-sans text-lg text-accent-light">{dress.price.toLocaleString()} so'm</span>
                            <span className="text-xs font-sans bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">{dress.timesRented}x kiyilgan</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeInUp} className="text-center">
              <Link href="/dresses">
                <Button size="lg" className="px-10 shadow-gold hover:shadow-[0_0_40px_rgba(197,163,88,0.4)] transition-all duration-500">
                  Barcha ko'ylaklarni ko'rish
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-section relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection>
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <p className="text-accent font-sans text-sm tracking-widest uppercase mb-4">Fikrlar</p>
              <h2 className="font-serif text-4xl md:text-5xl light-text-primary mb-4">Mijozlarimiz nima deydi?</h2>
            </motion.div>

            <motion.div variants={scaleIn} className="max-w-4xl mx-auto">
              <div className="relative bg-background/90 dark:bg-background/30 backdrop-blur-xl border border-accent/10 dark:border-accent/20 p-10 md:p-14 rounded-2xl shadow-luxury">
                <div className="absolute -top-6 left-10 font-serif text-8xl text-accent/30 dark:text-accent/40">"</div>
                <div className="relative">
                  <p className="font-serif text-xl md:text-2xl light-text-primary mb-10 leading-relaxed italic">{testimonials[activeTestimonial].text}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar fallback={testimonials[activeTestimonial].name.charAt(0)} size="lg" />
                      <div>
                        <p className="font-serif text-lg light-text-primary">{testimonials[activeTestimonial].name}</p>
                        <p className="text-sm font-sans light-text-muted">{testimonials[activeTestimonial].role}</p>
                      </div>
                    </div>
                    <Rating value={testimonials[activeTestimonial].rating} />
                  </div>
                </div>
                <div className="flex justify-center gap-3 mt-10">
                  {testimonials.map((_, i) => (
                    <button key={i} onClick={() => setActiveTestimonial(i)} className={cn("h-2 rounded-full transition-all duration-500", i === activeTestimonial ? "w-10 bg-gradient-to-r from-accent to-accent-light shadow-gold" : "w-2 bg-nude dark:bg-champagne hover:bg-champagne dark:hover:bg-accent/50")} />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <motion.div variants={scaleIn} className="relative overflow-hidden bg-gradient-to-br from-accent via-accent-dark to-accent p-14 md:p-20 rounded-3xl shadow-[0_0_80px_rgba(197,163,88,0.3)]">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />

              <div className="relative text-center max-w-3xl mx-auto">
                <Gift className="w-16 h-16 text-white/90 mx-auto mb-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]" />
                <h2 className="font-serif text-4xl md:text-5xl text-white mb-6 drop-shadow-lg">Go'zallik sayohatingizni bugun boshlang!</h2>
                <p className="font-sans text-xl text-white/90 mb-10">Ro'yxatdan o'ting va birinchi navbatingizga <span className="font-semibold text-white px-2 py-1 bg-white/20 rounded-lg">10% chegirma</span> oling</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/register">
                    <Button size="lg" className="btn-cta-white px-10 py-6 text-lg shadow-[0_10px_40px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_50px_rgba(0,0,0,0.3)] transition-all duration-500">
                      Ro'yxatdan o'tish
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button variant="outline" size="lg" className="btn-cta-outline px-10 py-6 text-lg backdrop-blur-sm transition-all duration-500">
                      <Phone className="mr-2 h-5 w-5" />
                      Bog'lanish
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* App Download Section */}
      <section className="py-20 bg-section relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="font-serif text-2xl light-text-primary mb-2">Tez orada mobil ilova!</h3>
              <p className="font-sans light-text-muted">iOS va Android uchun VELORA ilovasi tez orada chiqadi</p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="px-6 border-accent/20 dark:border-accent/30 hover:border-accent hover:bg-accent/5 dark:hover:bg-accent/10 transition-all duration-500" disabled>
                <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                App Store
              </Button>
              <Button variant="outline" className="px-6 border-accent/20 dark:border-accent/30 hover:border-accent hover:bg-accent/5 dark:hover:bg-accent/10 transition-all duration-500" disabled>
                <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/></svg>
                Google Play
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
