'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, ChevronRight, ChevronLeft, Check, 
  Scissors, Palette, Eye, Heart, Clock, Wallet,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface Question {
  id: string
  question: string
  options: {
    id: string
    label: string
    icon?: any
    description?: string
  }[]
}

const questions: Question[] = [
  {
    id: 'category',
    question: 'Qanday xizmat kerak?',
    options: [
      { id: 'SOCH', label: 'Soch xizmatlari', icon: Scissors, description: 'Kesish, boyash, davolash' },
      { id: 'TIRNOQ', label: 'Tirnoq xizmatlari', icon: Palette, description: 'Manikyur, pedikyur' },
      { id: 'QOSH', label: 'Qosh va kiprik', icon: Eye, description: 'Dizayn, uzaytirish' },
      { id: 'MAKIYAJ', label: 'Makiyaj', icon: Heart, description: 'Kundalik, bayram, to\'y' },
    ]
  },
  {
    id: 'time',
    question: 'Qancha vaqtingiz bor?',
    options: [
      { id: '30', label: '30 daqiqagacha', icon: Clock, description: 'Tezkor xizmatlar' },
      { id: '60', label: '1 soatgacha', icon: Clock, description: 'O\'rtacha xizmatlar' },
      { id: '120', label: '2 soatgacha', icon: Clock, description: 'To\'liq xizmatlar' },
      { id: 'unlimited', label: 'Vaqt muhim emas', icon: Clock, description: 'Barcha xizmatlar' },
    ]
  },
  {
    id: 'budget',
    question: 'Byudjetingiz qancha?',
    options: [
      { id: 'low', label: '100,000 so\'mgacha', icon: Wallet, description: 'Tejamkor' },
      { id: 'medium', label: '100,000 - 300,000', icon: Wallet, description: 'O\'rtacha' },
      { id: 'high', label: '300,000 - 500,000', icon: Wallet, description: 'Premium' },
      { id: 'unlimited', label: 'Byudjet muhim emas', icon: Wallet, description: 'VIP' },
    ]
  }
]

const recommendations = {
  SOCH: [
    { name: 'Soch kesish', price: '50,000 - 150,000', duration: '30-60 daqiqa' },
    { name: 'Soch bo\'yash', price: '150,000 - 400,000', duration: '2-3 soat' },
    { name: 'Soch davolash', price: '100,000 - 250,000', duration: '1-2 soat' },
    { name: 'Ukladka', price: '80,000 - 200,000', duration: '30-60 daqiqa' },
  ],
  TIRNOQ: [
    { name: 'Klassik manikyur', price: '50,000 - 80,000', duration: '45 daqiqa' },
    { name: 'Gel lak', price: '80,000 - 150,000', duration: '1 soat' },
    { name: 'Nail art', price: '100,000 - 200,000', duration: '1.5 soat' },
    { name: 'Pedikyur', price: '70,000 - 120,000', duration: '1 soat' },
  ],
  QOSH: [
    { name: 'Qosh dizayni', price: '30,000 - 60,000', duration: '30 daqiqa' },
    { name: 'Qosh bo\'yash', price: '40,000 - 80,000', duration: '45 daqiqa' },
    { name: 'Kiprik uzaytirish', price: '150,000 - 300,000', duration: '2 soat' },
    { name: 'Laminirlash', price: '100,000 - 180,000', duration: '1 soat' },
  ],
  MAKIYAJ: [
    { name: 'Kundalik makiyaj', price: '80,000 - 150,000', duration: '45 daqiqa' },
    { name: 'Bayram makiyaji', price: '150,000 - 300,000', duration: '1 soat' },
    { name: 'To\'y makiyaji', price: '300,000 - 600,000', duration: '2 soat' },
    { name: 'Makiyaj darsi', price: '200,000 - 400,000', duration: '2 soat' },
  ],
}

export default function RecommendationPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)

  const handleSelect = (questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }))
  }

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      setShowResults(true)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleRestart = () => {
    setCurrentStep(0)
    setAnswers({})
    setShowResults(false)
  }

  const currentQuestion = questions[currentStep]
  const selectedCategory = answers.category as keyof typeof recommendations
  const results = selectedCategory ? recommendations[selectedCategory] : []

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-rose-gold to-mauve mb-6 shadow-rose">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Men uchun mos xizmat
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {showResults 
              ? 'Sizga mos xizmatlar topildi!' 
              : 'Bir necha savolga javob bering va sizga mos xizmatni topamiz'}
          </p>
        </motion.div>

        {!showResults ? (
          <>
            {/* Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Savol {currentStep + 1} / {questions.length}</span>
                <span className="text-sm text-gray-500">{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
              </div>
              <div className="h-2 bg-cream dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-rose-gold to-mauve"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Question */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
                  {currentQuestion.question}
                </h2>

                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {currentQuestion.options.map((option) => {
                    const Icon = option.icon
                    const isSelected = answers[currentQuestion.id] === option.id
                    return (
                      <Card
                        key={option.id}
                        className={cn(
                          "cursor-pointer transition-all duration-300 hover:-translate-y-1",
                          isSelected 
                            ? "border-2 border-rose-gold shadow-rose" 
                            : "border-2 border-transparent hover:border-champagne"
                        )}
                        onClick={() => handleSelect(currentQuestion.id, option.id)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className={cn(
                              "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                              isSelected 
                                ? "bg-gradient-to-br from-rose-gold to-mauve" 
                                : "bg-cream dark:bg-gray-700"
                            )}>
                              {Icon && <Icon className={cn("h-6 w-6", isSelected ? "text-white" : "text-gray-600 dark:text-gray-300")} />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-800 dark:text-white">{option.label}</h3>
                                {isSelected && (
                                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-rose-gold to-mauve flex items-center justify-center">
                                    <Check className="h-4 w-4 text-white" />
                                  </div>
                                )}
                              </div>
                              {option.description && (
                                <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="rounded-xl"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Orqaga
              </Button>
              <Button
                onClick={handleNext}
                disabled={!answers[currentQuestion.id]}
                className="rounded-xl bg-gradient-to-r from-rose-gold to-mauve hover:from-mauve hover:to-rose-gold"
              >
                {currentStep === questions.length - 1 ? 'Natijani ko\'rish' : 'Keyingi'}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </>
        ) : (
          /* Results */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid gap-4 mb-8">
              {results.map((service, idx) => (
                <Card key={idx} className="hover:shadow-luxury-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-2">
                          {service.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Wallet className="h-4 w-4" />
                            {service.price} so'm
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {service.duration}
                          </span>
                        </div>
                      </div>
                      <Link href={`/masters?category=${selectedCategory}`}>
                        <Button className="rounded-xl">
                          Stilist tanlash
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" onClick={handleRestart} className="rounded-xl">
                Qaytadan boshlash
              </Button>
              <Link href="/services">
                <Button className="rounded-xl bg-gradient-to-r from-rose-gold to-mauve">
                  Barcha xizmatlar
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
