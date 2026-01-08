import type { 
  User, 
  Master, 
  Service, 
  Appointment, 
  Review
} from '@prisma/client'

export type { 
  User, 
  Master, 
  Service, 
  Appointment, 
  Review
}

// Enum types as string literals
export type UserRole = 'CLIENT' | 'MASTER' | 'ADMIN'
export type Theme = 'LIGHT' | 'DARK' | 'SYSTEM'
export type Specialization = 'SOCH' | 'TIRNOQ' | 'QOSH' | 'MAKIYAJ'
export type AppointmentStatus = 'RESERVED' | 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
export type BonusType = 'EARNED' | 'REDEEMED' | 'EXPIRED'
export type TargetAudience = 'ALL' | 'NEW_CLIENTS' | 'RETURNING_CLIENTS' | 'INACTIVE_CLIENTS'

export interface TimeSlot {
  startTime: string
  endTime: string
  isAvailable: boolean
  isDiscounted?: boolean
  discountPercent?: number
}

export interface MasterWithUser extends Master {
  user: User
}

export interface MasterDetail extends MasterWithUser {
  services: MasterServiceWithService[]
  reviews: ReviewWithClient[]
  portfolio: { url: string; thumbnail: string }[]
}

export interface MasterServiceWithService {
  id: string
  price: number
  service: Service
}

export interface ReviewWithClient extends Review {
  client: {
    name: string | null
    avatar: string | null
  }
}

export interface AppointmentWithDetails extends Appointment {
  master: MasterWithUser
  service?: Service
}

export interface QuizQuestion {
  id: string
  question: string
  options: QuizOption[]
}

export interface QuizOption {
  id: string
  label: string
  value: string
}

export interface QuizAnswer {
  questionId: string
  value: string
}

export interface Recommendation {
  service: Service
  master: MasterWithUser
  price: number
  duration: number
  rating: number
  nearestSlot: {
    date: string
    time: string
  }
  score: number
}

export interface EarningsReport {
  total: number
  byService: { serviceName: string; amount: number; count: number }[]
  byDay: { date: string; amount: number }[]
}

export interface DashboardStats {
  todayAppointments: number
  todayEarnings: number
  totalClients: number
  averageRating: number
}

export interface AdminStats {
  totalBookings: number
  totalRevenue: number
  activeUsers: number
  newUsersToday: number
  conversionRate: number
}
