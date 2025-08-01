import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class InertiaDashboardController {
  async index({ inertia, auth }: HttpContext) {
    await auth.use('jwt').authenticate()

    // Mock hotel dashboard data - in a real app, this would come from your services
    const dashboardData = {
      hotelStats: {
        totalRooms: 150,
        occupiedRooms: 118,
        availableRooms: 32,
        occupancyRate: 78.7,
        averageRate: 185.5,
        totalRevenue: 21847.0,
        todayCheckIns: 24,
        todayCheckOuts: 18,
      },
      recentBookings: [
        {
          id: 1,
          guestName: 'John Smith',
          roomNumber: '205',
          checkIn: DateTime.now().toISODate(),
          checkOut: DateTime.now().plus({ days: 3 }).toISODate(),
          status: 'confirmed',
          amount: 450.0,
        },
        {
          id: 2,
          guestName: 'Maria Garcia',
          roomNumber: '312',
          checkIn: DateTime.now().plus({ days: 1 }).toISODate(),
          checkOut: DateTime.now().plus({ days: 5 }).toISODate(),
          status: 'pending',
          amount: 740.0,
        },
        {
          id: 3,
          guestName: 'David Johnson',
          roomNumber: '108',
          checkIn: DateTime.now().minus({ days: 1 }).toISODate(),
          checkOut: DateTime.now().plus({ days: 2 }).toISODate(),
          status: 'checked_in',
          amount: 555.0,
        },
      ],
      occupancyTrend: [
        { date: '2025-01-25', occupancy: 75.2 },
        { date: '2025-01-26', occupancy: 82.1 },
        { date: '2025-01-27', occupancy: 79.8 },
        { date: '2025-01-28', occupancy: 85.3 },
        { date: '2025-01-29', occupancy: 78.7 },
        { date: '2025-01-30', occupancy: 81.4 },
        { date: '2025-01-31', occupancy: 78.7 },
      ],
      roomTypeOccupancy: [
        { type: 'Standard', total: 80, occupied: 62, rate: 77.5 },
        { type: 'Deluxe', total: 40, occupied: 34, rate: 85.0 },
        { type: 'Suite', total: 20, occupied: 15, rate: 75.0 },
        { type: 'Presidential', total: 10, occupied: 7, rate: 70.0 },
      ],
      housekeepingStatus: {
        clean: 45,
        dirty: 28,
        outOfOrder: 3,
        maintenance: 2,
      },
    }

    return inertia.render('hotel/dashboard', dashboardData)
  }
}
