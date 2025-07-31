import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Hotel from '#models/hotel'
import User from '#models/user'
import { GuestFactory } from '#database/factories/guest_factory'
import { ReservationFactory } from '#database/factories/reservation_factory'
import { PaymentFactory } from '#database/factories/payment_factory'
import { FolioFactory } from '#database/factories/folio_factory'
import { DateTime } from 'luxon'
import logger from '@adonisjs/core/services/logger'

export default class extends BaseSeeder {
  static environment = ['development']

  async run() {
    logger.info('Creating demo bookings...')

    const hotels = await Hotel.query()
      .preload('rooms', (query) => query.preload('room_type'))
      .preload('organization')

    for (const hotel of hotels) {
      logger.info(`  Creating bookings for ${hotel.name}...`)

      // Number of guests based on hotel size
      const guestCount = Math.min(Math.floor(hotel.rooms.length * 2), 100)

      // Create varied guests
      const guestTypes = [
        { state: 'regular', percentage: 0.6 },
        { state: 'vip', percentage: 0.15 },
        { state: 'corporate', percentage: 0.2 },
        { state: 'family', percentage: 0.05 },
      ]

      const guests = []
      let currentCount = 0

      for (const type of guestTypes) {
        const count = Math.floor(guestCount * type.percentage)
        for (let i = 0; i < count && currentCount < guestCount; i++) {
          const guest = await GuestFactory.merge({ organization_id: hotel.organization_id })
            .apply(type.state as any)
            .create()
          guests.push(guest)
          currentCount++
        }
      }

      // Get a front desk user to create reservations
      const frontDeskUser = await User.query()
        .where('organization_id', hotel.organization_id)
        .where('email', 'not like', '%admin%')
        .first()

      // Distribute reservation types
      const today = DateTime.now()
      const reservationScenarios = [
        {
          status: 'confirmed' as const,
          timeframe: 'future',
          checkIn: () => today.plus({ days: Math.floor(Math.random() * 30) + 1 }),
          nights: () => Math.floor(Math.random() * 7) + 1,
          percentage: 0.25,
        },
        {
          status: 'checked_in' as const,
          timeframe: 'current',
          checkIn: () => today.minus({ days: Math.floor(Math.random() * 3) }),
          nights: () => Math.floor(Math.random() * 7) + 2,
          percentage: 0.35,
        },
        {
          status: 'checked_out' as const,
          timeframe: 'past',
          checkIn: () => today.minus({ days: Math.floor(Math.random() * 30) + 7 }),
          nights: () => Math.floor(Math.random() * 5) + 1,
          percentage: 0.3,
        },
        {
          status: 'cancelled' as const,
          timeframe: 'mixed',
          checkIn: () => today.plus({ days: Math.floor(Math.random() * 60) - 30 }),
          nights: () => Math.floor(Math.random() * 4) + 1,
          percentage: 0.1,
        },
      ]

      let reservationCount = 0
      let guestIndex = 0

      for (const scenario of reservationScenarios) {
        const scenarioCount = Math.floor(guests.length * scenario.percentage)

        for (let i = 0; i < scenarioCount && guestIndex < guests.length; i++) {
          const guest = guests[guestIndex++]
          const availableRooms = hotel.rooms.filter(
            (r) => r.housekeeping_status === 'clean' || scenario.timeframe === 'future'
          )

          if (availableRooms.length === 0) continue

          const room = availableRooms[Math.floor(Math.random() * availableRooms.length)]
          const checkInDate = scenario.checkIn()
          const nights = scenario.nights()
          const checkOutDate = checkInDate.plus({ days: nights })

          // Create the reservation
          const reservation = await ReservationFactory.merge({
            organization_id: hotel.organization_id,
            hotel_id: hotel.id,
            room_id: room.id,
            room_type_id: room.room_type_id,
            guest_id: guest.id,
            created_by_user_id: frontDeskUser?.id,
            status: scenario.status,
            check_in_date: checkInDate,
            check_out_date: checkOutDate,
            room_rate: room.room_type.base_price,
            total_amount: room.room_type.base_price * nights,
          }).create()

          // For non-cancelled reservations, create folio and payments
          if (scenario.status !== 'cancelled') {
            // Create folio
            const folio = await FolioFactory.merge({
              organization_id: hotel.organization_id,
              reservation_id: reservation.id,
              guest_id: guest.id,
              status: scenario.status === 'checked_out' ? 'closed' : 'open',
              room_charges: room.room_type.base_price * nights,
              closed_by_user_id: scenario.status === 'checked_out' ? frontDeskUser?.id : null,
              closed_at: scenario.status === 'checked_out' ? checkOutDate : null,
            }).create()

            // Create payments based on status
            if (scenario.status === 'checked_in' || scenario.status === 'checked_out') {
              // Partial or total payment
              const paidAmount =
                scenario.status === 'checked_out'
                  ? folio.total_amount
                  : folio.total_amount * (0.3 + Math.random() * 0.5) // 30-80% paid

              await PaymentFactory.merge({
                organization_id: hotel.organization_id,
                reservation_id: reservation.id,
                folio_id: folio.id,
                guest_id: guest.id,
                amount: paidAmount,
                status: 'completed',
                paid_at: scenario.status === 'checked_out' ? checkOutDate : checkInDate,
                processed_by_user_id: frontDeskUser?.id,
              }).create()
            }
          }

          reservationCount++
        }
      }

      logger.info(
        `    ✓ Created ${guests.length} guests and ${reservationCount} reservations for ${hotel.name}`
      )
    }

    logger.info('✓ Demo bookings created successfully')
  }
}
