'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { UserPlus, ArrowRight, User, Scissors, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loading } from '@/components/ui/loading'
import { cn } from '@/lib/utils'

type RoleType = 'CLIENT' | 'MASTER'

const roles = [
  { 
    id: 'CLIENT' as RoleType, 
    label: 'Mijoz', 
    description: 'Xizmatlardan foydalanish',
    icon: User 
  },
  { 
    id: 'MASTER' as RoleType, 
    label: 'Usta', 
    description: 'Xizmat ko\'rsatish',
    icon: Scissors 
  },
]

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [role, setRole] = useState<RoleType>('CLIENT')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
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
    
    if (!firstName.trim()) {
      setError('Ismingizni kiriting')
      return
    }
    
    if (!lastName.trim()) {
      setError('Familiyangizni kiriting')
      return
    }
    
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
        body: JSON.stringify({ 
          phone: `+998${cleanPhone}`, 
          isRegister: true,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          role: role
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Xatolik yuz berdi')
      }

      sessionStorage.setItem('registerName', `${firstName.trim()} ${lastName.trim()}`)
      sessionStorage.setItem('registerRole', role)
      
      router.push(`/verify?phone=${encodeURIComponent(`+998${cleanPhone}`)}&mode=register`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xatolik yuz berdi')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="shadow-xl border-0">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center bg-accent">
          <UserPlus className="h-7 w-7 text-white" />
        </div>
        <CardTitle className="font-serif text-2xl light-text-primary">Ro'yxatdan o'tish</CardTitle>
        <CardDescription className="light-text-muted">
          {step === 1 ? 'Qanday foydalanmoqchisiz?' : 'Ma\'lumotlaringizni kiriting'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 1 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {roles.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={cn(
                    "p-6 rounded-lg border-2 transition-all text-center",
                    role === r.id 
                      ? "border-accent bg-accent/5" 
                      : "border-nude hover:border-accent/50"
                  )}
                >
                  <r.icon className={cn(
                    "h-10 w-10 mx-auto mb-3",
                    role === r.id ? "text-accent" : "light-text-muted"
                  )} />
                  <p className="font-medium light-text-primary">{r.label}</p>
                  <p className="text-xs light-text-muted mt-1">{r.description}</p>
                </button>
              ))}
            </div>
            <Button onClick={() => setStep(2)} className="w-full h-12">
              Davom etish
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-accent/10 rounded-lg mb-4">
              {role === 'CLIENT' ? <User className="h-5 w-5 text-accent" /> : <Scissors className="h-5 w-5 text-accent" />}
              <span className="text-sm light-text-secondary">
                {role === 'CLIENT' ? 'Mijoz sifatida' : 'Usta sifatida'} ro'yxatdan o'tyapsiz
              </span>
              <button type="button" onClick={() => setStep(1)} className="ml-auto text-xs text-accent hover:underline">
                O'zgartirish
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium light-text-secondary">Ism</label>
                <Input
                  type="text"
                  placeholder="Malika"
                  value={firstName}
                  onChange={(e) => { setFirstName(e.target.value); setError('') }}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium light-text-secondary">Familiya</label>
                <Input
                  type="text"
                  placeholder="Karimova"
                  value={lastName}
                  onChange={(e) => { setLastName(e.target.value); setError('') }}
                  className="h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium light-text-secondary">Telefon raqam</label>
              <div className="flex">
                <div className="flex h-12 items-center rounded-l-lg border-2 border-r-0 border-nude bg-light-gray px-3 text-sm light-text-muted">
                  +998
                </div>
                <Input
                  type="tel"
                  placeholder="90 123 45 67"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="rounded-l-none"
                  maxLength={12}
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <Button type="submit" className="w-full h-12" disabled={isLoading}>
              {isLoading ? (
                <Loading size="sm" className="mr-2" />
              ) : (
                <ArrowRight className="mr-2 h-4 w-4" />
              )}
              SMS kod olish
            </Button>

            <button type="button" onClick={() => setStep(1)} className="w-full text-sm light-text-muted hover:text-accent">
              ← Orqaga
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm">
          <span className="light-text-muted">Akkauntingiz bormi? </span>
          <Link href="/login" className="font-medium text-accent hover:underline">
            Tizimga kiring
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
