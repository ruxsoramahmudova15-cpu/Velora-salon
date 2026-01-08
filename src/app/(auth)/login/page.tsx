'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Phone, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loading } from '@/components/ui/loading'

export default function LoginPage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const formatPhoneInput = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 2) return numbers
    if (numbers.length <= 4) return `${numbers.slice(0, 2)} ${numbers.slice(2)}`
    if (numbers.length <= 7) return `${numbers.slice(0, 2)} ${numbers.slice(2, 5)} ${numbers.slice(5)}`
    if (numbers.length <= 9) return `${numbers.slice(0, 2)} ${numbers.slice(2, 5)} ${numbers.slice(5, 7)} ${numbers.slice(7)}`
    return `${numbers.slice(0, 2)} ${numbers.slice(2, 5)} ${numbers.slice(5, 7)} ${numbers.slice(7, 9)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneInput(e.target.value)
    setPhone(formatted)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleanPhone = phone.replace(/\s/g, '')
    
    if (cleanPhone.length !== 9) {
      setError('Telefon raqamni to\'liq kiriting')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `+998${cleanPhone}` }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Xatolik yuz berdi')
      }

      router.push(`/verify?phone=${encodeURIComponent(`+998${cleanPhone}`)}&mode=login`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xatolik yuz berdi')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="shadow-xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-dark">
          <Phone className="h-7 w-7 text-white" />
        </div>
        <CardTitle className="text-2xl light-text-primary">Tizimga kirish</CardTitle>
        <CardDescription className="light-text-muted">
          Telefon raqamingizni kiriting
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium light-text-secondary">
              Telefon raqam
            </label>
            <div className="flex">
              <div className="flex h-12 items-center rounded-l-xl border-2 border-r-0 border-nude bg-light-gray px-3 text-sm light-text-muted">
                +998
              </div>
              <Input
                type="tel"
                placeholder="90 123 45 67"
                value={phone}
                onChange={handlePhoneChange}
                className="rounded-l-none"
                maxLength={12}
                error={error}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <Loading size="sm" className="mr-2" />
            ) : (
              <ArrowRight className="mr-2 h-4 w-4" />
            )}
            Davom etish
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="light-text-muted">Akkauntingiz yo'qmi? </span>
          <Link href="/register" className="font-medium text-accent hover:underline">
            Ro'yxatdan o'ting
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
