import type { Metadata } from 'next'
import { Playfair_Display, Montserrat } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { LayoutWrapper } from '@/components/layout/layout-wrapper'

const playfair = Playfair_Display({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-playfair',
  display: 'swap',
})

const montserrat = Montserrat({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'VELORA - Go\'zallik Platformasi',
    template: '%s | VELORA'
  },
  description: 'O\'zbekistondagi eng zamonaviy go\'zallik platformasi. Soch, tirnoq, qosh va makiyaj xizmatlari. Onlayn navbat olish.',
  keywords: ['salon', 'go\'zallik', 'soch', 'manikyur', 'makiyaj', 'navbat', 'O\'zbekiston', 'kelin ko\'ylak'],
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'VELORA - Go\'zallik Platformasi',
    description: 'O\'zbekistondagi eng zamonaviy go\'zallik platformasi',
    siteName: 'VELORA',
    locale: 'uz_UZ',
    type: 'website',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#1A1A1A' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body className={`${montserrat.variable} ${playfair.variable} font-sans antialiased`}>
        <ThemeProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
