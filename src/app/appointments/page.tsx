'use client'

import { Calendar, Clock, MapPin, User } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AppointmentsPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 mb-4 shadow-lg">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Navbatlarim
          </h1>
          <p className="text-gray-500">
            Sizning barcha navbatlaringiz shu yerda
          </p>
        </div>

        <div className="text-center py-16">
          <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-6">
            <Calendar className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Hozircha navbatlar yo'q
          </h2>
          <p className="text-gray-500 mb-6">
            Xizmat tanlang va navbat oling
          </p>
          <Link href="/services">
            <Button className="rounded-xl">
              Xizmatlarni ko'rish
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
