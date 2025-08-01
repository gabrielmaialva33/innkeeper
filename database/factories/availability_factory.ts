import factory from '@adonisjs/lucid/factories'
import Availability from '#models/availability'
import { DateTime } from 'luxon'
import { PricingHelper } from '../helpers/pricing_helper.js'

export const AvailabilityFactory = factory
  .define(Availability, async ({ faker }) => {
    // Generate a date between today and 365 days from now
    const date = DateTime.fromJSDate(
      faker.date.between({ from: new Date(), to: DateTime.now().plus({ days: 365 }).toJSDate() })
    )

    // Total inventory for this room type (realistic range based on hotel size)
    const total_inventory = faker.number.int({ min: 5, max: 30 })

    // Calculate seasonal occupancy patterns
    const seasonalMultiplier = PricingHelper.getSeasonalMultiplier(date.toJSDate())
    const baseOccupancy = seasonalMultiplier > 1.2 ? 0.85 : seasonalMultiplier > 1 ? 0.7 : 0.5

    // Day of week patterns (weekends tend to be busier for leisure hotels)
    const dayOfWeek = date.weekday
    const isWeekend = dayOfWeek >= 5
    const dayMultiplier = isWeekend ? 1.2 : 0.9

    // Calculate occupancy with some randomness
    const occupancyRate = Math.min(
      0.95,
      baseOccupancy * dayMultiplier * faker.number.float({ min: 0.8, max: 1.2 })
    )

    // Calculate room allocations
    const sold_rooms = Math.floor(total_inventory * occupancyRate)
    const out_of_order_rooms = faker.datatype.boolean(0.1)
      ? faker.number.int({ min: 1, max: 2 })
      : 0
    const complimentary_rooms = faker.datatype.boolean(0.05) ? 1 : 0
    const house_use_rooms = faker.datatype.boolean(0.05) ? 1 : 0
    const blocked_rooms = faker.datatype.boolean(0.2) ? faker.number.int({ min: 1, max: 3 }) : 0

    // Calculate available rooms
    const available_rooms = Math.max(
      0,
      total_inventory - sold_rooms - out_of_order_rooms - complimentary_rooms - house_use_rooms
    )

    // Overbooking strategy (allow up to 10% overbooking during high season)
    const overbooking_limit =
      seasonalMultiplier > 1.2 && occupancyRate > 0.8 ? Math.ceil(total_inventory * 0.1) : 0

    // Stop sell when nearly full
    const stop_sell = available_rooms <= 1 && !overbooking_limit

    // Restrictions based on occupancy
    const closed_to_arrival = occupancyRate > 0.9 && isWeekend
    const closed_to_departure = false // Usually only for special events

    // Minimum stay requirements (higher during peak times)
    const minimum_stay = seasonalMultiplier > 1.2 ? 2 : 1
    const maximum_stay = faker.datatype.boolean(0.1) ? faker.number.int({ min: 7, max: 14 }) : null

    // Channel restrictions (different inventory pools for OTAs)
    const channel_restrictions: Record<string, { stop_sell: boolean; available_rooms: number }> = {}
    if (faker.datatype.boolean(0.7)) {
      // Allocate inventory to channels
      const otaAllocation = Math.floor(available_rooms * 0.6)
      channel_restrictions.booking = {
        stop_sell: otaAllocation <= 0,
        available_rooms: otaAllocation,
      }
      channel_restrictions.expedia = {
        stop_sell: otaAllocation <= 0,
        available_rooms: otaAllocation,
      }
      channel_restrictions.direct = {
        stop_sell: false,
        available_rooms: available_rooms,
      }
    }

    return {
      date,
      total_inventory,
      available_rooms,
      blocked_rooms,
      sold_rooms,
      out_of_order_rooms,
      complimentary_rooms,
      house_use_rooms,
      minimum_stay,
      maximum_stay,
      stop_sell,
      closed_to_arrival,
      closed_to_departure,
      overbooking_limit,
      channel_restrictions,
      metadata: {
        created_via: 'factory',
        occupancy_rate: occupancyRate,
        seasonal_factor: seasonalMultiplier,
        forecast_accuracy: faker.number.float({ min: 0.85, max: 0.98 }),
      },
    }
  })
  .state('highSeason', (availability, { faker }) => {
    const occupancy = faker.number.float({ min: 0.85, max: 0.95 })
    availability.sold_rooms = Math.floor(availability.total_inventory * occupancy)
    availability.available_rooms = availability.total_inventory - availability.sold_rooms
    availability.minimum_stay = 2
    availability.overbooking_limit = Math.ceil(availability.total_inventory * 0.1)
  })
  .state('lowSeason', (availability, { faker }) => {
    const occupancy = faker.number.float({ min: 0.3, max: 0.5 })
    availability.sold_rooms = Math.floor(availability.total_inventory * occupancy)
    availability.available_rooms = availability.total_inventory - availability.sold_rooms
    availability.minimum_stay = 1
    availability.stop_sell = false
    availability.overbooking_limit = 0
  })
  .state('soldOut', (availability) => {
    availability.sold_rooms = availability.total_inventory
    availability.available_rooms = 0
    availability.stop_sell = true
    availability.closed_to_arrival = true
  })
  .state('maintenance', (availability, { faker }) => {
    const maintenance_rooms = faker.number.int({
      min: 1,
      max: Math.floor(availability.total_inventory * 0.3),
    })
    availability.out_of_order_rooms = maintenance_rooms
    availability.available_rooms = Math.max(
      0,
      availability.total_inventory - availability.sold_rooms - maintenance_rooms
    )
  })
  .state('groupBlock', (availability, { faker }) => {
    const block_size = faker.number.int({
      min: 5,
      max: Math.floor(availability.total_inventory * 0.5),
    })
    availability.blocked_rooms = block_size
    availability.available_rooms = Math.max(
      0,
      availability.total_inventory - availability.sold_rooms - block_size
    )
  })
  .state('restrictedChannels', (availability) => {
    availability.channel_restrictions = {
      booking: { stop_sell: true, available_rooms: 0 },
      expedia: { stop_sell: true, available_rooms: 0 },
      direct: { stop_sell: false, available_rooms: availability.available_rooms },
    }
  })
  .build()
