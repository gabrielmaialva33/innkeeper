import { DateTime } from 'luxon'

export interface PricingFactors {
  basePrice: number
  checkInDate: DateTime
  checkOutDate: DateTime
  occupancyRate: number
  roomTypeCategory: 'economy' | 'standard' | 'deluxe' | 'suite' | 'presidential'
  bookingLeadTime: number // days in advance
  stayLength: number // number of nights
}

export class PricingHelper {
  // Seasonal multipliers
  private static readonly SEASONAL_MULTIPLIERS = {
    peak: 1.5, // Jun-Aug, Dec
    high: 1.3, // Apr-May, Sep-Oct
    regular: 1.0, // Mar, Nov
    low: 0.8, // Jan-Feb
  }

  // Day of week multipliers
  private static readonly DAY_MULTIPLIERS = {
    monday: 0.9,
    tuesday: 0.9,
    wednesday: 0.95,
    thursday: 1.0,
    friday: 1.2,
    saturday: 1.3,
    sunday: 1.1,
  }

  // Occupancy-based multipliers
  private static readonly OCCUPANCY_MULTIPLIERS = [
    { threshold: 0.3, multiplier: 0.85 },
    { threshold: 0.5, multiplier: 0.95 },
    { threshold: 0.7, multiplier: 1.1 },
    { threshold: 0.85, multiplier: 1.3 },
    { threshold: 0.95, multiplier: 1.5 },
  ]

  // Lead time discounts/premiums
  private static readonly LEAD_TIME_MULTIPLIERS = [
    { days: 0, multiplier: 1.3 }, // Same day
    { days: 1, multiplier: 1.2 }, // Next day
    { days: 3, multiplier: 1.1 }, // Within 3 days
    { days: 7, multiplier: 1.0 }, // Within a week
    { days: 30, multiplier: 0.95 }, // Within a month
    { days: 60, multiplier: 0.9 }, // 2 months advance
    { days: 90, multiplier: 0.85 }, // 3+ months advance
  ]

  // Length of stay discounts
  private static readonly LENGTH_DISCOUNTS = [
    { nights: 7, discount: 0.1 }, // Weekly stay
    { nights: 14, discount: 0.15 }, // Two weeks
    { nights: 30, discount: 0.25 }, // Monthly stay
  ]

  /**
   * Calculate dynamic price based on multiple factors
   */
  static calculateDynamicPrice(factors: PricingFactors): number {
    let price = factors.basePrice

    // Apply seasonal multiplier
    const seasonMultiplier = this.getSeasonalMultiplier(factors.checkInDate)
    price *= seasonMultiplier

    // Apply day of week multiplier (average for the stay)
    const dayMultiplier = this.getAverageDayMultiplier(factors.checkInDate, factors.checkOutDate)
    price *= dayMultiplier

    // Apply occupancy multiplier
    const occupancyMultiplier = this.getOccupancyMultiplier(factors.occupancyRate)
    price *= occupancyMultiplier

    // Apply lead time multiplier
    const leadTimeMultiplier = this.getLeadTimeMultiplier(factors.bookingLeadTime)
    price *= leadTimeMultiplier

    // Apply length of stay discount
    const lengthDiscount = this.getLengthDiscount(factors.stayLength)
    price *= 1 - lengthDiscount

    // Round to 2 decimal places
    return Math.round(price * 100) / 100
  }

  /**
   * Get seasonal multiplier based on check-in date
   */
  static getSeasonalMultiplier(date: DateTime): number {
    const month = date.month

    // Peak season: June-August, December
    if ([6, 7, 8, 12].includes(month)) {
      return this.SEASONAL_MULTIPLIERS.peak
    }
    // High season: April-May, September-October
    else if ([4, 5, 9, 10].includes(month)) {
      return this.SEASONAL_MULTIPLIERS.high
    }
    // Low season: January-February
    else if ([1, 2].includes(month)) {
      return this.SEASONAL_MULTIPLIERS.low
    }
    // Regular season: March, November
    else {
      return this.SEASONAL_MULTIPLIERS.regular
    }
  }

  /**
   * Calculate average day of week multiplier for the stay
   */
  private static getAverageDayMultiplier(checkIn: DateTime, checkOut: DateTime): number {
    let totalMultiplier = 0
    let dayCount = 0

    let currentDate = checkIn
    while (currentDate < checkOut) {
      const dayName = currentDate
        .toFormat('cccc')
        .toLowerCase() as keyof typeof this.DAY_MULTIPLIERS
      totalMultiplier += this.DAY_MULTIPLIERS[dayName] || 1
      dayCount++
      currentDate = currentDate.plus({ days: 1 })
    }

    return dayCount > 0 ? totalMultiplier / dayCount : 1
  }

  /**
   * Get occupancy-based price multiplier
   */
  private static getOccupancyMultiplier(occupancyRate: number): number {
    // Find the appropriate multiplier based on occupancy threshold
    for (let i = this.OCCUPANCY_MULTIPLIERS.length - 1; i >= 0; i--) {
      if (occupancyRate >= this.OCCUPANCY_MULTIPLIERS[i].threshold) {
        return this.OCCUPANCY_MULTIPLIERS[i].multiplier
      }
    }
    return 1
  }

  /**
   * Get lead time multiplier based on booking advance
   */
  private static getLeadTimeMultiplier(leadTimeDays: number): number {
    // Find the appropriate multiplier based on lead time
    for (const tier of this.LEAD_TIME_MULTIPLIERS) {
      if (leadTimeDays <= tier.days) {
        return tier.multiplier
      }
    }
    return this.LEAD_TIME_MULTIPLIERS[this.LEAD_TIME_MULTIPLIERS.length - 1].multiplier
  }

  /**
   * Get length of stay discount
   */
  private static getLengthDiscount(nights: number): number {
    // Find the appropriate discount based on stay length
    for (let i = this.LENGTH_DISCOUNTS.length - 1; i >= 0; i--) {
      if (nights >= this.LENGTH_DISCOUNTS[i].nights) {
        return this.LENGTH_DISCOUNTS[i].discount
      }
    }
    return 0
  }

  /**
   * Generate a realistic occupancy rate based on season and day
   */
  static generateOccupancyRate(date: DateTime, hotelType: string): number {
    const baseOccupancy =
      {
        city: 0.65,
        beach: 0.55,
        business: 0.7,
        boutique: 0.6,
        luxury: 0.5,
      }[hotelType] || 0.6

    // Seasonal adjustment
    const seasonMultiplier = this.getSeasonalMultiplier(date)
    let occupancy = baseOccupancy * (0.8 + (seasonMultiplier - 1) * 0.4)

    // Weekend adjustment for business hotels
    if (hotelType === 'business' && [6, 7].includes(date.weekday)) {
      occupancy *= 0.6 // Lower occupancy on weekends
    }

    // Add some randomness
    const randomFactor = 0.9 + Math.random() * 0.2
    occupancy *= randomFactor

    // Ensure occupancy is between 0.1 and 0.98
    return Math.max(0.1, Math.min(0.98, occupancy))
  }

  /**
   * Calculate cancellation probability based on various factors
   */
  static getCancellationProbability(
    leadTimeDays: number,
    guestType: string,
    isRefundable: boolean
  ): number {
    let probability = 0.1 // Base 10% cancellation rate

    // Lead time factor - more likely to cancel if booked far in advance
    if (leadTimeDays > 60) probability += 0.1
    if (leadTimeDays > 30) probability += 0.05

    // Guest type factor
    if (guestType === 'corporate') probability -= 0.05 // Corporate less likely to cancel
    if (guestType === 'firstTime') probability += 0.05 // First time guests more likely

    // Refundable bookings have higher cancellation rates
    if (isRefundable) probability += 0.15

    return Math.max(0, Math.min(0.4, probability)) // Cap between 0-40%
  }
}
