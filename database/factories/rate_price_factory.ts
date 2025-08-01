import factory from '@adonisjs/lucid/factories'
import RatePrice from '#models/rate_price'
import { DateTime } from 'luxon'
import { PricingHelper } from '../helpers/pricing_helper.js'

export const RatePriceFactory = factory
  .define(RatePrice, async ({ faker }) => {
    // Generate a date for pricing (today to 365 days from now)
    const date = DateTime.fromJSDate(
      faker.date.between({ from: new Date(), to: DateTime.now().plus({ days: 365 }).toJSDate() })
    )

    // Base prices vary by room type (will be overridden when associated with actual room type)
    const baseRates = [
      { single: 100, double: 120 }, // Standard room
      { single: 150, double: 180 }, // Deluxe room
      { single: 200, double: 250 }, // Suite
      { single: 300, double: 350 }, // Presidential suite
    ]

    const baseRate = faker.helpers.arrayElement(baseRates)

    // Calculate dynamic pricing based on multiple factors
    const pricingFactors = {
      basePrice: baseRate.single,
      checkInDate: date.toJSDate(),
      leadTime: faker.number.int({ min: 0, max: 180 }),
      occupancyRate: faker.number.float({ min: 0.3, max: 0.95 }),
      stayLength: faker.number.int({ min: 1, max: 14 }),
    }

    const dynamicSinglePrice = PricingHelper.calculateDynamicPrice(pricingFactors)
    const dynamicDoublePrice = PricingHelper.calculateDynamicPrice({
      ...pricingFactors,
      basePrice: baseRate.double,
    })

    // Triple and quad rates (not all rooms support these)
    const supportsTriple = faker.datatype.boolean(0.7)
    const supportsQuad = faker.datatype.boolean(0.5)

    const amount_triple = supportsTriple ? Math.round(dynamicDoublePrice * 1.25) : null

    const amount_quad = supportsQuad ? Math.round(dynamicDoublePrice * 1.45) : null

    // Extra charges
    const extra_adult_charge = Math.round(dynamicSinglePrice * 0.3)
    const extra_child_charge = Math.round(dynamicSinglePrice * 0.15)

    // Breakfast value (if included in rate plan)
    const breakfast_included_value = faker.datatype.boolean(0.4)
      ? faker.number.int({ min: 15, max: 35 })
      : 0

    // Override scenarios (manual price adjustments)
    const is_override = faker.datatype.boolean(0.1)
    const override_reason = is_override
      ? faker.helpers.arrayElement([
          'Special event pricing',
          'Group rate adjustment',
          'Competitive price match',
          'Long stay discount',
          'Corporate negotiated rate',
          'Seasonal promotion',
        ])
      : null

    // Yield management adjustments
    const yield_adjustments = {
      occupancy_threshold: faker.number.int({ min: 60, max: 85 }),
      adjustment_percentage: faker.number.int({ min: 5, max: 25 }),
      last_minute_discount: faker.number.int({ min: 10, max: 30 }),
      early_bird_discount: faker.number.int({ min: 5, max: 20 }),
    }

    return {
      date,
      currency: faker.helpers.arrayElement(['USD', 'EUR', 'GBP', 'BRL']),
      amount_single: dynamicSinglePrice,
      amount_double: dynamicDoublePrice,
      amount_triple,
      amount_quad,
      extra_adult_charge,
      extra_child_charge,
      breakfast_included_value,
      is_override,
      override_reason,
      override_by_user_id: is_override ? faker.number.int({ min: 1, max: 10 }) : null,
      is_approved: !is_override || faker.datatype.boolean(0.9),
      approved_by_user_id:
        is_override && faker.datatype.boolean(0.9) ? faker.number.int({ min: 1, max: 5 }) : null,
      approved_at:
        is_override && faker.datatype.boolean(0.9)
          ? DateTime.fromJSDate(faker.date.recent({ days: 7 }))
          : null,
      yield_adjustments,
      metadata: {
        created_via: 'factory',
        pricing_factors: pricingFactors,
        seasonal_factor: PricingHelper.getSeasonalMultiplier(date.toJSDate()),
        day_of_week: date.weekdayLong,
      },
    }
  })
  .state('highSeason', (price, { faker }) => {
    // Increase prices by 30-50% for high season
    const multiplier = faker.number.float({ min: 1.3, max: 1.5 })
    price.amount_single = Math.round(price.amount_single * multiplier)
    price.amount_double = Math.round(price.amount_double * multiplier)
    if (price.amount_triple) price.amount_triple = Math.round(price.amount_triple * multiplier)
    if (price.amount_quad) price.amount_quad = Math.round(price.amount_quad * multiplier)
    price.metadata.season = 'high'
  })
  .state('lowSeason', (price, { faker }) => {
    // Decrease prices by 20-30% for low season
    const multiplier = faker.number.float({ min: 0.7, max: 0.8 })
    price.amount_single = Math.round(price.amount_single * multiplier)
    price.amount_double = Math.round(price.amount_double * multiplier)
    if (price.amount_triple) price.amount_triple = Math.round(price.amount_triple * multiplier)
    if (price.amount_quad) price.amount_quad = Math.round(price.amount_quad * multiplier)
    price.metadata.season = 'low'
  })
  .state('weekend', (price, { faker }) => {
    // Weekend premium (10-20%)
    const multiplier = faker.number.float({ min: 1.1, max: 1.2 })
    price.amount_single = Math.round(price.amount_single * multiplier)
    price.amount_double = Math.round(price.amount_double * multiplier)
    if (price.amount_triple) price.amount_triple = Math.round(price.amount_triple * multiplier)
    if (price.amount_quad) price.amount_quad = Math.round(price.amount_quad * multiplier)
    price.metadata.weekend_rate = true
  })
  .state('lastMinute', (price, { faker }) => {
    // Last minute discount (15-30%)
    const discount = faker.number.float({ min: 0.7, max: 0.85 })
    price.amount_single = Math.round(price.amount_single * discount)
    price.amount_double = Math.round(price.amount_double * discount)
    if (price.amount_triple) price.amount_triple = Math.round(price.amount_triple * discount)
    if (price.amount_quad) price.amount_quad = Math.round(price.amount_quad * discount)
    price.is_override = true
    price.override_reason = 'Last minute discount'
    price.metadata.discount_type = 'last_minute'
  })
  .state('corporate', (price, { faker }) => {
    // Corporate rates (10-15% discount)
    const discount = faker.number.float({ min: 0.85, max: 0.9 })
    price.amount_single = Math.round(price.amount_single * discount)
    price.amount_double = Math.round(price.amount_double * discount)
    if (price.amount_triple) price.amount_triple = Math.round(price.amount_triple * discount)
    if (price.amount_quad) price.amount_quad = Math.round(price.amount_quad * discount)
    price.breakfast_included_value = 20
    price.metadata.rate_type = 'corporate'
  })
  .state('package', (price) => {
    // Package deals include extras
    price.breakfast_included_value = 25
    price.metadata.includes = ['breakfast', 'spa_credit', 'late_checkout']
    price.metadata.rate_type = 'package'
  })
  .build()
