'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ShieldCheck, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loading } from '@/components/ui/loading'
import { useAuthStore } from '@/store/auth-store'
import { cn } from '@/lib/utils'

function VerifyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const phone = searchParams.get('phone') || ''
  const mode = searchParams.get('mode') || 'login'
  
  const { setUser } = useAuthStore()
  const [code, setCode] = useState(['', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value.slice(-1)
    setCode(newCode)
    setError('')

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }

    if (newCode.every(digit => digit) && newCode.join('').length === 4) {
      handleVerify(newCode.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
    const newCode = [...code]
    pastedData.split('').forEach((digit, index) => {
      if (index < 4) newCode[index] = digit
    })
    setCode(newCode)
    
    if (pastedData.length === 4) {
      handleVerify(pastedData)
    }
  }

  const handleVerify = async (verificationCode: string) => {
    setIsLoading(true)
    setError('')

    try {
      const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login'
      
      // Get stored name and role for registration
      const storedName = sessionStorage.getItem('registerName')
      const storedRole = sessionStorage.getItem('registerRole')
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone, 
          code: verificationCode,
          ...(mode === 'register' && { 
            name: storedName,
            role: storedRole || 'CLIENT'
          })
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Xatolik yuz berdi')
      }

      // Clear session storage
      sessionStorage.removeItem('registerName')
      sessionStorage.removeItem('registerRole')

      setUser(data.user)
      
      // Redirect based on role
      if (mode === 'register') {
        if (data.user.role === 'MASTER') {
          router.push('/master')
        } else {
          router.push('/profile/setup')
        }
      } else {
        // Login - redirect based on role
        if (data.user.role === 'ADMIN') {
          router.push('/admin')
        } else if (data.user.role === 'MASTER') {
          router.push('/master')
        } else {
          router.push('/')
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xatolik yuz berdi')
      setCode(['', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setCanResend(false)
    setCountdown(60)
    setError('')

    try {
      await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
    } catch {
      setError('Kodni qayta yuborishda xatolik')
    }
  }

  return (
    <Card className="shadow-xl">
      <CardHeader className="text-center">
        <Button
          variant="ghost"
          size="sm"
          className="absolute left-4 top-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-dark">
          <ShieldCheck className="h-7 w-7 text-white" />
        </div>
        <CardTitle className="text-2xl light-text-primary">Kodni kiriting</CardTitle>
        <CardDescription className="light-text-muted">
          {phone} raqamiga yuborilgan 4 xonali kodni kiriting
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-center gap-2" onPaste={handlePaste}>
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={cn(
                  'h-14 w-12 rounded-xl border-2 text-center text-xl font-semibold input-field',
                  'transition-all focus:outline-none focus:ring-2 focus:ring-accent/20',
                  error
                    ? 'border-red-400 focus:border-red-400'
                    : 'border-nude focus:border-accent'
                )}
                disabled={isLoading}
              />
            ))}
          </div>

          {error && (
            <p className="text-center text-sm text-red-500">{error}</p>
          )}

          {isLoading && (
            <div className="flex justify-center">
              <Loading />
            </div>
          )}

          <div className="text-center">
            {canResend ? (
              <button
                onClick={handleResend}
                className="text-sm font-medium text-accent hover:underline"
              >
                Kodni qayta yuborish
              </button>
            ) : (
              <p className="text-sm light-text-muted">
                Qayta yuborish: {countdown} soniya
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<Loading />}>
      <VerifyContent />
    </Suspense>
  )
}
