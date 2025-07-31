import factory from '@adonisjs/lucid/factories'
import { FactoryContextContract } from '@adonisjs/lucid/types/factory'
import { DateTime } from 'luxon'
import Reservation from '#models/reservation'
import { HotelFactory } from './hotel_factory.js'
import { RoomFactory } from './room_factory.js'
import { GuestFactory } from './guest_factory.js'
import { UserFactory } from './user_factory.js'

export const ReservationFactory = factory
  .define(Reservation, async ({ faker }: FactoryContextContract) => {
    // Generate check-in date between 30 days ago and 60 days in the future
    const checkInDate = faker.date.between({
      from: DateTime.now().minus({ days: 30 }).toJSDate(),
      to: DateTime.now().plus({ days: 60 }).toJSDate(),
    })

    // Generate stay duration (1-14 nights, weighted towards shorter stays)
    const stayNights = faker.helpers.weightedArrayElement([
      { value: 1, weight: 20 },
      { value: 2, weight: 30 },
      { value: 3, weight: 20 },
      { value: 4, weight: 10 },
      { value: 5, weight: 8 },
      { value: 6, weight: 5 },
      { value: 7, weight: 4 },
      { value: faker.number.int({ min: 8, max: 14 }), weight: 3 },
    ])

    const checkOutDate = DateTime.fromJSDate(checkInDate).plus({ days: stayNights }).toJSDate()

    // Generate number of guests
    const adults = faker.number.int({ min: 1, max: 4 })
    const children = faker.datatype.boolean({ probability: 0.3 })
      ? faker.number.int({ min: 1, max: 3 })
      : 0

    // Base price calculation (will be overridden based on room type)
    const basePrice = faker.number.float({ min: 100, max: 500, fractionDigits: 2 })
    const nightlyRate = basePrice
    const subtotal = nightlyRate * stayNights
    const taxRate = faker.number.float({ min: 0.08, max: 0.15, fractionDigits: 4 })
    const taxAmount = subtotal * taxRate
    const totalAmount = subtotal + taxAmount

    const confirmationCode = faker.string.alphanumeric({ length: 8, casing: 'upper' })

    return {
      organization_id: 0, // Will be set by relation
      hotel_id: 0, // Will be set by relation
      room_id: 0, // Will be set by relation
      guest_id: 0, // Will be set by relation
      created_by_user_id: 0, // Will be set by relation
      confirmation_code: confirmationCode,
      check_in_date: DateTime.fromJSDate(checkInDate),
      check_out_date: DateTime.fromJSDate(checkOutDate),
      adults,
      children,
      infants: 0,
      status: faker.helpers.weightedArrayElement([
        { value: 'confirmed', weight: 50 },
        { value: 'pending', weight: 10 },
        { value: 'checked_in', weight: 20 },
        { value: 'checked_out', weight: 15 },
        { value: 'cancelled', weight: 4 },
        { value: 'no_show', weight: 1 },
      ]),
      special_requests: faker.datatype.boolean({ probability: 0.4 })
        ? faker.helpers.arrayElement([
            'Late check-in after 10 PM',
            'Early check-in requested',
            'High floor room preferred',
            'Quiet room away from elevator',
            'Celebrating anniversary',
            'Birthday celebration - please add cake',
            'Extra towels and pillows',
            'Crib needed for infant',
            'Adjoining rooms if possible',
          ])
        : null,
      arrival_time: faker.helpers.arrayElement([
        '14:00',
        '15:00',
        '16:00',
        '17:00',
        '18:00',
        '19:00',
        '20:00',
      ]),
      purpose_of_visit: faker.helpers.arrayElement(['leisure', 'business', 'event', 'other']),
      room_rate: nightlyRate,
      total_amount: totalAmount,
      paid_amount: faker.datatype.boolean({ probability: 0.7 })
        ? faker.number.float({ min: 50, max: 200, fractionDigits: 2 })
        : 0,
      discount_amount: 0,
      tax_amount: taxAmount,
      currency: 'USD',
      source: faker.helpers.arrayElement([
        'direct',
        'booking.com',
        'expedia',
        'phone',
        'walk_in',
        'corporate',
      ]),
      payment_status: 'pending' as const,
      payment_method: faker.helpers.arrayElement([
        'cash',
        'card',
        'bank_transfer',
        'online',
        'other',
      ]) as 'cash' | 'card' | 'bank_transfer' | 'online' | 'other',
      is_vip: faker.datatype.boolean({ probability: 0.05 }),
      requires_pickup: faker.datatype.boolean({ probability: 0.2 }),
      pickup_location: null,
      pickup_time: null,
      cancelled_at: null,
      cancellation_reason: null,
      cancelled_by_user_id: null,
      guest_details: {
        additional_guests: [],
      },
      metadata: {
        booking_ip: faker.internet.ipv4(),
        browser: faker.helpers.arrayElement(['Chrome', 'Safari', 'Firefox', 'Edge']),
        device: faker.helpers.arrayElement(['desktop', 'mobile', 'tablet']),
        referrer: faker.helpers.arrayElement([
          'google',
          'direct',
          'social_media',
          'email_campaign',
        ]),
        promo_code: faker.datatype.boolean({ probability: 0.2 })
          ? faker.string.alphanumeric({ length: 6, casing: 'upper' })
          : null,
        is_repeat_guest: faker.datatype.boolean({ probability: 0.3 }),
        special_rate: faker.helpers.arrayElement([
          'standard',
          'corporate',
          'government',
          'aaa',
          'senior',
        ]),
        room_preferences: {
          bed_type: faker.helpers.arrayElement(['king', 'queen', 'twin']),
          floor: faker.helpers.arrayElement(['high', 'low', 'any']),
          view: faker.helpers.arrayElement(['ocean', 'city', 'garden', 'any']),
          smoking: false,
        },
      },
    }
  })
  .relation('hotel', () => HotelFactory)
  .relation('room', () => RoomFactory)
  .relation('guest', () => GuestFactory)
  .relation('createdBy', () => UserFactory)
  .state('pending', (reservation) => {
    reservation.status = 'pending'
    reservation.metadata.pending_reason = 'Awaiting payment confirmation'
  })
  .state('confirmed', (reservation, { faker }) => {
    reservation.status = 'confirmed'
    reservation.paid_amount = reservation.total_amount * 0.2
    reservation.payment_status = 'partial'
    reservation.metadata.confirmation_sent_at = faker.date.recent({ days: 1 })
  })
  .state('checkedIn', (reservation, { faker }) => {
    reservation.status = 'checked_in'
    reservation.check_in_date = DateTime.fromJSDate(faker.date.recent({ days: 2 }))
    reservation.check_out_date = DateTime.fromJSDate(faker.date.future({ years: 0.02 })) // Within a week
    reservation.paid_amount = reservation.total_amount * 0.2
    reservation.payment_status = 'partial'
    reservation.metadata.actual_check_in_time = faker.date.recent({ days: 1 }).toISOString()
    reservation.metadata.checked_in_by = 'Front Desk Staff'
  })
  .state('checkedOut', (reservation, { faker }) => {
    reservation.status = 'checked_out'
    reservation.check_in_date = DateTime.fromJSDate(faker.date.recent({ days: 7 }))
    reservation.check_out_date = DateTime.fromJSDate(faker.date.recent({ days: 1 }))
    reservation.paid_amount = reservation.total_amount
    reservation.payment_status = 'paid'
    reservation.metadata.actual_check_in_time = reservation.check_in_date.toISO()
    reservation.metadata.actual_check_out_time = reservation.check_out_date.toISO()
    reservation.metadata.checked_out_by = 'Front Desk Staff'
    reservation.metadata.final_bill_sent = true
  })
  .state('cancelled', (reservation, { faker }) => {
    reservation.status = 'cancelled'
    reservation.cancelled_at = DateTime.fromJSDate(faker.date.recent({ days: 5 }))
    reservation.cancellation_reason = faker.helpers.arrayElement([
      'Guest requested cancellation',
      'Flight cancelled',
      'Change of plans',
      'Found better rate',
      'Medical emergency',
      'Weather conditions',
    ])
    reservation.metadata.cancellation_fee = faker.number.float({
      min: 0,
      max: 100,
      fractionDigits: 2,
    })
    reservation.metadata.refund_processed = faker.datatype.boolean({ probability: 0.8 })
  })
  .state('noShow', (reservation, { faker }) => {
    reservation.status = 'no_show'
    reservation.check_in_date = DateTime.fromJSDate(faker.date.recent({ days: 2 }))
    reservation.metadata.no_show_fee_charged = true
    reservation.metadata.no_show_fee = reservation.room_rate
  })
  .state('lastMinute', (reservation, { faker }) => {
    // Booking made within 24 hours of check-in
    const checkIn = faker.date.soon({ days: 1 })
    reservation.check_in_date = DateTime.fromJSDate(checkIn)
    reservation.check_out_date = DateTime.fromJSDate(checkIn).plus({
      days: faker.number.int({ min: 1, max: 3 }),
    })
    reservation.metadata.booking_lead_time = 'last_minute'
    reservation.metadata.special_rate = 'last_minute_deal'
  })
  .state('longStay', (reservation, { faker }) => {
    const checkIn = faker.date.future({ years: 0.1 })
    const stayNights = faker.number.int({ min: 14, max: 30 })
    reservation.check_in_date = DateTime.fromJSDate(checkIn)
    reservation.check_out_date = DateTime.fromJSDate(checkIn).plus({ days: stayNights })
    reservation.room_rate = reservation.room_rate * 0.85 // Long stay discount
    const subtotal = reservation.room_rate * stayNights
    reservation.tax_amount = subtotal * 0.1
    reservation.total_amount = subtotal + reservation.tax_amount
    reservation.discount_amount = subtotal * 0.15
    reservation.metadata.long_stay_discount = 0.15
  })
  .state('groupBooking', (reservation, { faker }) => {
    reservation.adults = faker.number.int({ min: 4, max: 8 })
    reservation.metadata.group_name = faker.company.name() + ' Group'
    reservation.metadata.group_size = faker.number.int({ min: 5, max: 20 })
    reservation.metadata.rooms_in_group = faker.number.int({ min: 3, max: 10 })
    reservation.metadata.group_coordinator = faker.person.fullName()
    reservation.metadata.special_rate = 'group_rate'
  })
  .state('earlyBird', (reservation, { faker }) => {
    // Booking made more than 60 days in advance
    const checkIn = faker.date.future({ years: 0.5 })
    reservation.check_in_date = DateTime.fromJSDate(checkIn)
    reservation.check_out_date = DateTime.fromJSDate(checkIn).plus({
      days: faker.number.int({ min: 2, max: 7 }),
    })
    reservation.room_rate = reservation.room_rate * 0.9 // Early bird discount
    reservation.metadata.booking_lead_time = 'early_bird'
    reservation.metadata.early_bird_discount = 0.1
  })
  .before('create', async (_factory, reservation) => {
    // Ensure check-out is after check-in
    if (reservation.check_out_date <= reservation.check_in_date) {
      reservation.check_out_date = reservation.check_in_date.plus({ days: 1 })
    }

    // Recalculate totals based on actual dates
    const nights = Math.ceil(
      reservation.check_out_date.diff(reservation.check_in_date, 'days').days
    )
    const subtotal = reservation.room_rate * nights
    reservation.tax_amount = subtotal * 0.1
    reservation.total_amount = subtotal + reservation.tax_amount - reservation.discount_amount

    // Set payment status based on paid amount
    if (reservation.paid_amount === 0) {
      reservation.payment_status = 'pending'
    } else if (reservation.paid_amount < reservation.total_amount) {
      reservation.payment_status = 'partial'
    } else {
      reservation.payment_status = 'paid'
    }
  })
  .build()
