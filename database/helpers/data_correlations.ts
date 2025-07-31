export interface GuestProfile {
  type: 'vip' | 'regular' | 'corporate' | 'family' | 'firstTime' | 'blacklisted'
  preferences: GuestPreferences
  behavior: GuestBehavior
}

export interface GuestPreferences {
  roomTypes: string[]
  floorPreference: 'high' | 'low' | 'any'
  bedType: 'king' | 'queen' | 'twin' | 'any'
  smokingPreference: boolean
  amenityPriorities: string[]
  priceRange: { min: number; max: number }
}

export interface GuestBehavior {
  avgStayLength: number
  bookingLeadTime: number
  cancellationRate: number
  serviceUsage: number // 0-1 scale
  complaintRate: number // 0-1 scale
  tipAmount: number // percentage
  loyaltyLevel: number // 0-5
}

export class DataCorrelations {
  /**
   * Guest profiles with realistic correlations
   */
  static readonly GUEST_PROFILES: Record<string, GuestProfile> = {
    vip: {
      type: 'vip',
      preferences: {
        roomTypes: ['presidential', 'suite', 'deluxe'],
        floorPreference: 'high',
        bedType: 'king',
        smokingPreference: false,
        amenityPriorities: ['spa', 'concierge', 'restaurant', 'gym'],
        priceRange: { min: 500, max: 5000 },
      },
      behavior: {
        avgStayLength: 3,
        bookingLeadTime: 30,
        cancellationRate: 0.05,
        serviceUsage: 0.8,
        complaintRate: 0.3, // High standards
        tipAmount: 0.2,
        loyaltyLevel: 5,
      },
    },
    corporate: {
      type: 'corporate',
      preferences: {
        roomTypes: ['deluxe', 'standard', 'business'],
        floorPreference: 'any',
        bedType: 'any',
        smokingPreference: false,
        amenityPriorities: ['wifi', 'business_center', 'gym', 'restaurant'],
        priceRange: { min: 150, max: 400 },
      },
      behavior: {
        avgStayLength: 2,
        bookingLeadTime: 7,
        cancellationRate: 0.1,
        serviceUsage: 0.4,
        complaintRate: 0.1,
        tipAmount: 0.15,
        loyaltyLevel: 3,
      },
    },
    family: {
      type: 'family',
      preferences: {
        roomTypes: ['suite', 'deluxe', 'family'],
        floorPreference: 'low',
        bedType: 'queen',
        smokingPreference: false,
        amenityPriorities: ['pool', 'restaurant', 'parking', 'wifi'],
        priceRange: { min: 100, max: 300 },
      },
      behavior: {
        avgStayLength: 4,
        bookingLeadTime: 45,
        cancellationRate: 0.15,
        serviceUsage: 0.6,
        complaintRate: 0.2,
        tipAmount: 0.12,
        loyaltyLevel: 2,
      },
    },
    regular: {
      type: 'regular',
      preferences: {
        roomTypes: ['standard', 'deluxe'],
        floorPreference: 'any',
        bedType: 'any',
        smokingPreference: false,
        amenityPriorities: ['wifi', 'parking', 'restaurant'],
        priceRange: { min: 80, max: 200 },
      },
      behavior: {
        avgStayLength: 2,
        bookingLeadTime: 21,
        cancellationRate: 0.12,
        serviceUsage: 0.5,
        complaintRate: 0.15,
        tipAmount: 0.15,
        loyaltyLevel: 3,
      },
    },
    firstTime: {
      type: 'firstTime',
      preferences: {
        roomTypes: ['standard', 'economy'],
        floorPreference: 'any',
        bedType: 'any',
        smokingPreference: false,
        amenityPriorities: ['wifi', 'parking'],
        priceRange: { min: 50, max: 150 },
      },
      behavior: {
        avgStayLength: 2,
        bookingLeadTime: 14,
        cancellationRate: 0.2,
        serviceUsage: 0.3,
        complaintRate: 0.1,
        tipAmount: 0.1,
        loyaltyLevel: 0,
      },
    },
  }

  /**
   * Get correlated check-in patterns based on guest type and day
   */
  static getCheckInPattern(
    guestType: string,
    dayOfWeek: number
  ): { time: string; probability: number }[] {
    const patterns = {
      corporate: [
        { time: '06:00', probability: 0.05 },
        { time: '07:00', probability: 0.1 },
        { time: '14:00', probability: 0.15 },
        { time: '15:00', probability: 0.2 },
        { time: '16:00', probability: 0.2 },
        { time: '17:00', probability: 0.15 },
        { time: '18:00', probability: 0.1 },
        { time: '19:00', probability: 0.05 },
      ],
      family: [
        { time: '12:00', probability: 0.1 },
        { time: '13:00', probability: 0.15 },
        { time: '14:00', probability: 0.2 },
        { time: '15:00', probability: 0.25 },
        { time: '16:00', probability: 0.15 },
        { time: '17:00', probability: 0.1 },
        { time: '18:00', probability: 0.05 },
      ],
      default: [
        { time: '14:00', probability: 0.15 },
        { time: '15:00', probability: 0.25 },
        { time: '16:00', probability: 0.25 },
        { time: '17:00', probability: 0.15 },
        { time: '18:00', probability: 0.1 },
        { time: '19:00', probability: 0.05 },
        { time: '20:00', probability: 0.05 },
      ],
    }

    // Corporate guests check in earlier on weekdays
    if (guestType === 'corporate' && dayOfWeek >= 1 && dayOfWeek <= 5) {
      return patterns.corporate
    }

    return patterns[guestType as keyof typeof patterns] || patterns.default
  }

  /**
   * Get correlated special requests based on guest type
   */
  static getSpecialRequests(guestType: string): { request: string; probability: number }[] {
    const requests = {
      vip: [
        { request: 'Late check-out until 4 PM', probability: 0.4 },
        { request: 'Champagne on arrival', probability: 0.3 },
        { request: 'Fresh flowers in room', probability: 0.25 },
        { request: 'Specific newspaper delivery', probability: 0.2 },
        { request: 'Hypoallergenic bedding', probability: 0.15 },
        { request: 'Private check-in', probability: 0.3 },
      ],
      corporate: [
        { request: 'Late check-in after 10 PM', probability: 0.3 },
        { request: 'Early check-in requested', probability: 0.25 },
        { request: 'Invoice to company', probability: 0.6 },
        { request: 'Near elevator for quick access', probability: 0.2 },
        { request: 'Extra power outlets for devices', probability: 0.15 },
      ],
      family: [
        { request: 'Crib needed for infant', probability: 0.3 },
        { request: 'Adjoining rooms if possible', probability: 0.25 },
        { request: 'Extra towels and pillows', probability: 0.2 },
        { request: 'Child-proof room', probability: 0.15 },
        { request: 'Near pool area', probability: 0.2 },
        { request: 'High chair in room', probability: 0.1 },
      ],
      default: [
        { request: 'High floor room preferred', probability: 0.2 },
        { request: 'Quiet room away from elevator', probability: 0.25 },
        { request: 'Early check-in requested', probability: 0.15 },
        { request: 'Late check-out requested', probability: 0.1 },
        { request: 'Extra pillows', probability: 0.1 },
      ],
    }

    return requests[guestType as keyof typeof requests] || requests.default
  }

  /**
   * Get correlated service usage based on guest type
   */
  static getServiceUsage(
    guestType: string
  ): { serviceCode: string; probability: number; avgSpend: number }[] {
    const usage = {
      vip: [
        { serviceCode: 'SPA', probability: 0.6, avgSpend: 300 },
        { serviceCode: 'RESTAURANT', probability: 0.8, avgSpend: 200 },
        { serviceCode: 'BAR', probability: 0.7, avgSpend: 150 },
        { serviceCode: 'CONCIERGE', probability: 0.5, avgSpend: 0 },
        { serviceCode: 'ROOM_SERVICE', probability: 0.7, avgSpend: 100 },
        { serviceCode: 'LAUNDRY', probability: 0.5, avgSpend: 80 },
      ],
      corporate: [
        { serviceCode: 'WIFI_PREMIUM', probability: 0.8, avgSpend: 20 },
        { serviceCode: 'BUSINESS_CENTER', probability: 0.4, avgSpend: 30 },
        { serviceCode: 'RESTAURANT', probability: 0.6, avgSpend: 50 },
        { serviceCode: 'BAR', probability: 0.3, avgSpend: 40 },
        { serviceCode: 'GYM', probability: 0.4, avgSpend: 0 },
        { serviceCode: 'LAUNDRY_EXPRESS', probability: 0.3, avgSpend: 60 },
      ],
      family: [
        { serviceCode: 'POOL', probability: 0.8, avgSpend: 0 },
        { serviceCode: 'RESTAURANT', probability: 0.7, avgSpend: 120 },
        { serviceCode: 'KIDS_CLUB', probability: 0.5, avgSpend: 50 },
        { serviceCode: 'BABYSITTING', probability: 0.2, avgSpend: 80 },
        { serviceCode: 'PARKING', probability: 0.9, avgSpend: 20 },
      ],
      default: [
        { serviceCode: 'WIFI', probability: 0.9, avgSpend: 0 },
        { serviceCode: 'RESTAURANT', probability: 0.5, avgSpend: 60 },
        { serviceCode: 'PARKING', probability: 0.4, avgSpend: 20 },
        { serviceCode: 'GYM', probability: 0.3, avgSpend: 0 },
      ],
    }

    return usage[guestType as keyof typeof usage] || usage.default
  }

  /**
   * Get payment method correlation based on guest type and amount
   */
  static getPaymentMethod(guestType: string, amount: number): string {
    const methods = {
      vip: { card: 0.8, bank_transfer: 0.15, online: 0.05, cash: 0 },
      corporate: { card: 0.6, bank_transfer: 0.3, online: 0.1, cash: 0 },
      family: { card: 0.7, online: 0.25, cash: 0.05, bank_transfer: 0 },
      default: { card: 0.6, online: 0.2, cash: 0.15, bank_transfer: 0.05 },
    }

    const profile = methods[guestType as keyof typeof methods] || methods.default

    // High amounts more likely to use bank transfer
    if (amount > 1000) {
      profile.bank_transfer += 0.1
      profile.cash = 0
    }

    // Normalize probabilities
    const total = Object.values(profile).reduce((sum, prob) => sum + prob, 0)
    const normalized = Object.entries(profile).map(([method, prob]) => ({
      method,
      probability: prob / total,
    }))

    // Select based on probability
    const random = Math.random()
    let cumulative = 0

    for (const { method, probability } of normalized) {
      cumulative += probability
      if (random <= cumulative) {
        return method
      }
    }

    return 'card' // fallback
  }

  /**
   * Generate realistic stay patterns based on guest type and purpose
   */
  static getStayPattern(
    guestType: string,
    purposeOfVisit: string
  ): {
    minNights: number
    maxNights: number
    mostLikely: number
  } {
    const patterns = {
      'corporate-business': { minNights: 1, maxNights: 5, mostLikely: 2 },
      'corporate-event': { minNights: 2, maxNights: 4, mostLikely: 3 },
      'family-leisure': { minNights: 2, maxNights: 14, mostLikely: 5 },
      'family-event': { minNights: 2, maxNights: 5, mostLikely: 3 },
      'vip-leisure': { minNights: 2, maxNights: 7, mostLikely: 4 },
      'vip-business': { minNights: 1, maxNights: 3, mostLikely: 2 },
      'regular-leisure': { minNights: 1, maxNights: 7, mostLikely: 3 },
      'regular-business': { minNights: 1, maxNights: 3, mostLikely: 2 },
      'default': { minNights: 1, maxNights: 5, mostLikely: 2 },
    }

    const key = `${guestType}-${purposeOfVisit}`
    return patterns[key as keyof typeof patterns] || patterns.default
  }
}
