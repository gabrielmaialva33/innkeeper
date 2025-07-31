import factory from '@adonisjs/lucid/factories'
import { FactoryContextContract } from '@adonisjs/lucid/types/factory'
import { DateTime } from 'luxon'
import Reservation from '#models/reservation'
import { HotelFactory } from './hotel_factory.js'
import { RoomFactory } from './room_factory.js'
import { GuestFactory } from './guest_factory.js'
import { UserFactory } from './user_factory.js'
import { PricingHelper } from '../helpers/pricing_helper.js'
import { DataCorrelations } from '../helpers/data_correlations.js'

export const ReservationFactory = factory
  .define(Reservation, async ({ faker }: FactoryContextContract) => {
    // First, determine the guest type to correlate all data
    const guestType = faker.helpers.weightedArrayElement([
      { value: 'regular', weight: 40 },
      { value: 'corporate', weight: 25 },
      { value: 'family', weight: 20 },
      { value: 'vip', weight: 10 },
      { value: 'firstTime', weight: 5 },
    ])

    // Get guest profile for correlations
    const guestProfile = DataCorrelations.GUEST_PROFILES[guestType]

    // Determine purpose of visit based on guest type
    const purposeOfVisit =
      guestType === 'corporate'
        ? faker.helpers.weightedArrayElement([
            { value: 'business', weight: 80 },
            { value: 'event', weight: 20 },
          ])
        : faker.helpers.weightedArrayElement([
            { value: 'leisure', weight: 70 },
            { value: 'event', weight: 20 },
            { value: 'other', weight: 10 },
          ])

    // Calculate booking lead time based on guest behavior
    const bookingLeadTime = faker.number.int({
      min: Math.max(0, guestProfile.behavior.bookingLeadTime - 10),
      max: guestProfile.behavior.bookingLeadTime + 20,
    })

    // Generate check-in date
    const checkInDate = DateTime.now().plus({ days: bookingLeadTime }).toJSDate()

    // Get stay pattern based on guest type and purpose
    const stayPattern = DataCorrelations.getStayPattern(guestType, purposeOfVisit)
    const stayNights = faker.number.int({
      min: stayPattern.minNights,
      max: stayPattern.maxNights,
    })

    const checkOutDate = DateTime.fromJSDate(checkInDate).plus({ days: stayNights }).toJSDate()

    // Determine number of guests based on type
    let adults = 1
    let children = 0
    let infants = 0

    if (guestType === 'family') {
      adults = faker.number.int({ min: 2, max: 2 })
      children = faker.number.int({ min: 1, max: 3 })
      infants = faker.datatype.boolean({ probability: 0.3 }) ? 1 : 0
    } else if (guestType === 'corporate') {
      adults = faker.helpers.weightedArrayElement([
        { value: 1, weight: 80 },
        { value: 2, weight: 20 },
      ])
    } else {
      adults = faker.number.int({ min: 1, max: 4 })
      children = faker.datatype.boolean({ probability: 0.1 })
        ? faker.number.int({ min: 1, max: 2 })
        : 0
    }

    // Room type preference based on guest profile
    const roomTypeCategory = faker.helpers.arrayElement(guestProfile.preferences.roomTypes) as
      | 'economy'
      | 'standard'
      | 'deluxe'
      | 'suite'
      | 'presidential'

    // Base price for room type
    const basePrices = {
      economy: 80,
      standard: 120,
      deluxe: 200,
      suite: 350,
      presidential: 800,
    }
    const basePrice = basePrices[roomTypeCategory]

    // Generate occupancy rate (will be provided by hotel in real implementation)
    const occupancyRate = PricingHelper.generateOccupancyRate(
      DateTime.fromJSDate(checkInDate),
      'city'
    )

    // Calculate dynamic price
    const dynamicPrice = PricingHelper.calculateDynamicPrice({
      basePrice,
      checkInDate: DateTime.fromJSDate(checkInDate),
      checkOutDate: DateTime.fromJSDate(checkOutDate),
      occupancyRate,
      roomTypeCategory,
      bookingLeadTime,
      stayLength: stayNights,
    })

    // Calculate totals
    const subtotal = dynamicPrice * stayNights
    const taxRate = 0.12 // 12% tax
    const taxAmount = subtotal * taxRate

    // Apply discounts based on guest type and length of stay
    let discountAmount = 0
    if (guestType === 'vip') {
      discountAmount = subtotal * 0.1 // 10% VIP discount
    } else if (guestType === 'corporate' && stayNights >= 5) {
      discountAmount = subtotal * 0.15 // 15% corporate extended stay
    } else if (stayNights >= 7) {
      discountAmount = subtotal * 0.1 // 10% weekly stay
    }

    const totalAmount = subtotal + taxAmount - discountAmount

    const confirmationCode = faker.string.alphanumeric({ length: 8, casing: 'upper' })

    return {
      organization_id: 0, // Will be set by relation
      hotel_id: 0, // Will be set by relation
      room_id: 0, // Will be set by relation
      room_type_id: 0, // Will be set by relation
      guest_id: 0, // Will be set by relation
      created_by_user_id: 0, // Will be set by relation
      group_reservation_id: null,
      confirmation_code: confirmationCode,
      check_in_date: DateTime.fromJSDate(checkInDate),
      check_out_date: DateTime.fromJSDate(checkOutDate),
      adults,
      children,
      infants,
      status: faker.helpers.weightedArrayElement([
        { value: 'confirmed', weight: 50 },
        { value: 'pending', weight: 10 },
        { value: 'checked_in', weight: 20 },
        { value: 'checked_out', weight: 15 },
        { value: 'cancelled', weight: 4 },
        { value: 'no_show', weight: 1 },
      ]),
      special_requests: (() => {
        const requests = DataCorrelations.getSpecialRequests(guestType)
        const selectedRequest = faker.helpers.weightedArrayElement(
          requests.map((r) => ({ value: r.request, weight: r.probability * 100 }))
        )
        return faker.datatype.boolean({ probability: 0.4 }) ? selectedRequest : null
      })(),
      arrival_time: (() => {
        const dayOfWeek = DateTime.fromJSDate(checkInDate).weekday
        const patterns = DataCorrelations.getCheckInPattern(guestType, dayOfWeek)
        return faker.helpers.weightedArrayElement(
          patterns.map((p) => ({ value: p.time, weight: p.probability * 100 }))
        )
      })(),
      purpose_of_visit: purposeOfVisit as 'leisure' | 'business' | 'event' | 'other',
      room_rate: dynamicPrice,
      total_amount: totalAmount,
      paid_amount: (() => {
        // Payment based on booking behavior and guest type
        const depositRate = 0.2 // 20% deposit default

        if (guestType === 'vip' || guestType === 'corporate') {
          // VIP and corporate usually pay deposit
          return totalAmount * depositRate
        } else if (bookingLeadTime === 0) {
          // Walk-in or same day bookings typically pay full
          return totalAmount
        } else {
          // Regular bookings may or may not have deposit
          return faker.datatype.boolean({ probability: 0.7 }) ? totalAmount * depositRate : 0
        }
      })(),
      discount_amount: discountAmount,
      tax_amount: taxAmount,
      currency: 'USD',
      channel: (() => {
        // Determine channel based on guest type and booking lead time
        if (guestType === 'corporate') {
          return 'corporate' as const
        } else if (bookingLeadTime === 0) {
          return faker.helpers.weightedArrayElement([
            { value: 'walkin' as const, weight: 70 },
            { value: 'phone' as const, weight: 30 },
          ])
        } else if (bookingLeadTime > 30) {
          return faker.helpers.weightedArrayElement([
            { value: 'ota' as const, weight: 50 },
            { value: 'website' as const, weight: 30 },
            { value: 'direct' as const, weight: 20 },
          ])
        } else {
          return faker.helpers.weightedArrayElement([
            { value: 'website' as const, weight: 40 },
            { value: 'ota' as const, weight: 30 },
            { value: 'phone' as const, weight: 20 },
            { value: 'direct' as const, weight: 10 },
          ])
        }
      })(),
      channel_reference: (() => {
        const channel =
          guestType === 'corporate' ? 'corporate' : bookingLeadTime === 0 ? 'walkin' : 'ota'
        if (channel === 'ota') {
          return faker.helpers.arrayElement(['BKG', 'EXP', 'AGD']) + faker.string.numeric(8)
        } else if (channel === 'corporate') {
          return 'CORP-' + faker.string.alphanumeric({ length: 6, casing: 'upper' })
        }
        return null
      })(),
      payment_status: 'pending' as const,
      payment_method: DataCorrelations.getPaymentMethod(guestType, totalAmount) as
        | 'cash'
        | 'card'
        | 'bank_transfer'
        | 'online'
        | 'other',
      is_vip: guestType === 'vip',
      requires_pickup:
        guestType === 'vip'
          ? faker.datatype.boolean({ probability: 0.5 })
          : guestType === 'corporate'
            ? faker.datatype.boolean({ probability: 0.3 })
            : faker.datatype.boolean({ probability: 0.1 }),
      pickup_location: null,
      pickup_time: null,
      actual_check_in: null,
      actual_check_out: null,
      cancelled_at: null,
      cancellation_reason: null,
      cancelled_by_user_id: null,
      is_deleted: false,
      guest_details: {
        additional_guests: [],
      },
      metadata: {
        // Booking source information
        booking_ip: faker.internet.ipv4(),
        browser: faker.helpers.arrayElement(['Chrome', 'Safari', 'Firefox', 'Edge']),
        device:
          guestType === 'corporate'
            ? faker.helpers.weightedArrayElement([
                { value: 'desktop', weight: 70 },
                { value: 'mobile', weight: 25 },
                { value: 'tablet', weight: 5 },
              ])
            : faker.helpers.weightedArrayElement([
                { value: 'mobile', weight: 50 },
                { value: 'desktop', weight: 35 },
                { value: 'tablet', weight: 15 },
              ]),
        referrer:
          guestType === 'corporate'
            ? 'corporate_portal'
            : faker.helpers.arrayElement(['google', 'direct', 'social_media', 'email_campaign']),

        // Pricing details
        base_rate: basePrice,
        dynamic_pricing: {
          final_rate: dynamicPrice,
          nights: stayNights,
          total_before_tax: subtotal,
          discount_percentage: discountAmount > 0 ? (discountAmount / subtotal) * 100 : 0,
        },
        occupancy_rate: occupancyRate,

        // Guest information
        guest_type: guestType,
        is_repeat_guest:
          guestType === 'regular' ||
          (guestType === 'vip' && faker.datatype.boolean({ probability: 0.8 })),
        loyalty_member:
          guestType === 'vip' ||
          (guestType === 'regular' && faker.datatype.boolean({ probability: 0.6 })),

        // Rate and promotional information
        special_rate:
          guestType === 'corporate'
            ? 'corporate'
            : guestType === 'vip'
              ? 'vip'
              : faker.helpers.arrayElement(['standard', 'aaa', 'senior', 'promotional']),
        promo_code:
          guestType === 'firstTime' && faker.datatype.boolean({ probability: 0.4 })
            ? 'FIRST10'
            : faker.datatype.boolean({ probability: 0.15 })
              ? faker.string.alphanumeric({ length: 6, casing: 'upper' })
              : null,

        // Room preferences from guest profile
        room_preferences: {
          bed_type: guestProfile.preferences.bedType,
          floor: guestProfile.preferences.floorPreference,
          view: faker.helpers.arrayElement(['ocean', 'city', 'garden', 'any']),
          smoking: guestProfile.preferences.smokingPreference,
          amenities: faker.helpers.arrayElements(guestProfile.preferences.amenityPriorities, {
            min: 0,
            max: 3,
          }),
        },

        // Additional context
        booking_context: {
          lead_time_days: bookingLeadTime,
          stay_nights: stayNights,
          total_guests: adults + children + infants,
          has_children: children > 0,
          has_infants: infants > 0,
        },
      },
    }
  })
  .relation('hotel', () => HotelFactory)
  .relation('room', () => RoomFactory)
  .relation('guest', () => GuestFactory)
  .relation('created_by', () => UserFactory)
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
