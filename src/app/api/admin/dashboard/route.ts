import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Trend hisoblash funksiyasi
export function calculateTrend(current: number, previous: number): 'up' | 'down' | 'stable' {
  if (current > previous) return 'up'
  if (current < previous) return 'down'
  return 'stable'
}

export async function GET(request: NextRequest) {
  try {
    const today = new Date()
    const startOfToday = new Date(today.setHours(0, 0, 0, 0))
    const startOfWeek = new Date(today)
    startOfWeek.setDate(startOfWeek.getDate() - 7)
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)

    // Get counts
    const [
      totalClients,
      newClientsToday,
      newClientsThisWeek,
      activeMasters,
      todayAppointments,
      lastWeekAppointments,
    ] = await Promise.all([
      db.user.count({ where: { role: 'CLIENT' } }),
      db.user.count({ 
        where: { 
          role: 'CLIENT',
          createdAt: { gte: startOfToday }
        } 
      }),
      db.user.count({ 
        where: { 
          role: 'CLIENT',
          createdAt: { gte: startOfWeek }
        } 
      }),
      db.master.count({ where: { isAvailable: true } }),
      db.appointment.count({
        where: {
          date: { gte: startOfToday }
        }
      }),
      db.appointment.count({
        where: {
          date: { 
            gte: new Date(startOfWeek.getTime() - 7 * 24 * 60 * 60 * 1000),
            lt: startOfWeek
          }
        }
      }),
    ])

    // Calculate revenue (mock data for now)
    const todayRevenue = 2500000
    const weeklyRevenue = 15000000
    const monthlyRevenue = 58000000
    const lastMonthRevenue = 52000000

    // Get recent activity
    const recentActivity = await db.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    // Calculate trends
    const trends = {
      revenue: calculateTrend(monthlyRevenue, lastMonthRevenue),
      clients: calculateTrend(newClientsThisWeek, 5), // Compare with last week
      appointments: calculateTrend(todayAppointments, lastWeekAppointments / 7),
    }

    // Top services (mock)
    const topServices = [
      { name: 'Gel lak', count: 234, revenue: 23400000 },
      { name: 'Kiprik uzaytirish', count: 189, revenue: 37800000 },
      { name: 'Qosh laminatsiya', count: 167, revenue: 25050000 },
      { name: 'Soch kesish', count: 156, revenue: 7800000 },
      { name: 'To\'y makiyaji', count: 67, revenue: 26800000 },
    ]

    // Top masters (mock)
    const topMasters = [
      { name: 'Malika U.', rating: 4.9, appointments: 128, revenue: 12800000 },
      { name: 'Nilufar S.', rating: 4.8, appointments: 112, revenue: 11200000 },
      { name: 'Zarina K.', rating: 4.9, appointments: 98, revenue: 9800000 },
      { name: 'Madina A.', rating: 4.7, appointments: 87, revenue: 8700000 },
    ]

    return NextResponse.json({
      stats: {
        todayRevenue,
        weeklyRevenue,
        monthlyRevenue,
        totalClients,
        newClientsToday,
        newClientsThisWeek,
        activeMasters,
        todayAppointments,
        trends,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recentActivity: recentActivity.map((a: any) => ({
        id: a.id,
        type: a.type,
        message: a.message,
        timestamp: a.createdAt,
      })),
      topServices,
      topMasters,
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { message: 'Serverda xatolik yuz berdi' },
      { status: 500 }
    )
  }
}
