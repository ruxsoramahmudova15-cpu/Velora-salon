import Link from 'next/link'
import { Instagram, Send, Phone } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-accent/10 dark:border-accent/20 bg-section relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center icon-box-accent rounded-xl transition-all duration-500 group-hover:shadow-gold group-hover:scale-105">
                <span className="font-serif text-lg text-white">V</span>
              </div>
              <span className="font-serif text-xl text-gradient">
                VELORA
              </span>
            </Link>
            <p className="text-sm font-sans light-text-secondary leading-relaxed">
              Ayollar uchun aqlli go'zallik platformasi. 
              O'zingizga mos xizmatni toping va navbat oling.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-6 font-serif text-lg light-text-primary">
              Sahifalar
            </h4>
            <ul className="space-y-3 text-sm font-sans">
              <li>
                <Link href="/masters" className="light-text-secondary hover:text-accent transition-colors duration-500">
                  Stilistlar
                </Link>
              </li>
              <li>
                <Link href="/services" className="light-text-secondary hover:text-accent transition-colors duration-500">
                  Xizmatlar
                </Link>
              </li>
              <li>
                <Link href="/dresses" className="light-text-secondary hover:text-accent transition-colors duration-500">
                  Kelin ko'ylaklar
                </Link>
              </li>
              <li>
                <Link href="/about" className="light-text-secondary hover:text-accent transition-colors duration-500">
                  Biz haqimizda
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-6 font-serif text-lg light-text-primary">
              Xizmatlar
            </h4>
            <ul className="space-y-3 text-sm font-sans">
              <li>
                <Link href="/services?category=SOCH" className="light-text-secondary hover:text-accent transition-colors duration-500">
                  Soch xizmatlari
                </Link>
              </li>
              <li>
                <Link href="/services?category=TIRNOQ" className="light-text-secondary hover:text-accent transition-colors duration-500">
                  Manikyur / Pedikyur
                </Link>
              </li>
              <li>
                <Link href="/services?category=QOSH" className="light-text-secondary hover:text-accent transition-colors duration-500">
                  Qosh xizmatlari
                </Link>
              </li>
              <li>
                <Link href="/services?category=MAKIYAJ" className="light-text-secondary hover:text-accent transition-colors duration-500">
                  Makiyaj
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-6 font-serif text-lg light-text-primary">
              Bog'lanish
            </h4>
            <ul className="space-y-4 text-sm font-sans">
              <li>
                <a 
                  href="tel:+998910832255" 
                  className="flex items-center gap-3 light-text-secondary hover:text-accent transition-colors duration-500 group"
                >
                  <div className="w-10 h-10 footer-icon-box rounded-xl flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all duration-500">
                    <Phone className="h-4 w-4 footer-icon group-hover:text-white transition-colors duration-500" />
                  </div>
                  +998 91 083 22 55
                </a>
              </li>
              <li>
                <a 
                  href="https://t.me/velora_uz" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 light-text-secondary hover:text-accent transition-colors duration-500 group"
                >
                  <div className="w-10 h-10 footer-icon-box rounded-xl flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all duration-500">
                    <Send className="h-4 w-4 footer-icon group-hover:text-white transition-colors duration-500" />
                  </div>
                  @velora_uz
                </a>
              </li>
              <li>
                <a 
                  href="https://instagram.com/velora_uz" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 light-text-secondary hover:text-accent transition-colors duration-500 group"
                >
                  <div className="w-10 h-10 footer-icon-box rounded-xl flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all duration-500">
                    <Instagram className="h-4 w-4 footer-icon group-hover:text-white transition-colors duration-500" />
                  </div>
                  @velora_uz
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-nude dark:border-accent/20 text-center">
          <p className="text-sm font-sans light-text-muted">
            © {new Date().getFullYear()} VELORA. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </div>
    </footer>
  )
}
