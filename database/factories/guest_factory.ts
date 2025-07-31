import factory from '@adonisjs/lucid/factories'
import { FactoryContextContract } from '@adonisjs/lucid/types/factory'
import { DateTime } from 'luxon'
import Guest from '#models/guest'
import { DataCorrelations } from '../helpers/data_correlations.js'

export const GuestFactory = factory
  .define(Guest, async ({ faker }: FactoryContextContract) => {
    // First, determine the guest type for correlations
    const guestType = faker.helpers.weightedArrayElement([
      { value: 'regular', weight: 40 },
      { value: 'corporate', weight: 25 },
      { value: 'family', weight: 20 },
      { value: 'vip', weight: 10 },
      { value: 'firstTime', weight: 5 },
    ])

    const guestProfile = DataCorrelations.GUEST_PROFILES[guestType]

    // Generate names based on guest type
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()

    // Corporate guests more likely to be from major business countries
    const corporateCountries = ['US', 'GB', 'DE', 'JP', 'CN', 'FR', 'CA', 'AU']
    const nationality =
      guestType === 'corporate'
        ? faker.helpers.arrayElement(corporateCountries)
        : faker.location.countryCode('alpha-2')

    // Generate realistic document numbers based on type
    const documentTypes = {
      passport: () => faker.string.alphanumeric({ length: 9, casing: 'upper' }),
      id_card: () => faker.string.numeric({ length: 11 }),
      driver_license: () => faker.string.alphanumeric({ length: 12, casing: 'upper' }),
    }

    // VIP and corporate guests more likely to have passports
    const documentType =
      guestType === 'vip' || guestType === 'corporate'
        ? faker.helpers.weightedArrayElement([
            { value: 'passport' as const, weight: 80 },
            { value: 'id_card' as const, weight: 15 },
            { value: 'driver_license' as const, weight: 5 },
          ])
        : (faker.helpers.objectKey(documentTypes) as keyof typeof documentTypes)

    const documentNumber = documentTypes[documentType]()

    // Age distribution based on guest type
    const ageRanges = {
      vip: { min: 35, max: 65 },
      corporate: { min: 28, max: 55 },
      family: { min: 30, max: 50 },
      regular: { min: 25, max: 60 },
      firstTime: { min: 18, max: 35 },
    }

    const ageRange = ageRanges[guestType as keyof typeof ageRanges] || { min: 18, max: 80 }
    const birthDate = faker.date.birthdate({ min: ageRange.min, max: ageRange.max, mode: 'age' })

    return {
      organization_id: 0, // Will be set by relation
      user_id: null,
      first_name: firstName,
      last_name: lastName,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      phone: faker.phone.number({ style: 'international' }),
      mobile: faker.datatype.boolean({ probability: 0.7 })
        ? faker.phone.number({ style: 'international' })
        : null,
      document_type: documentType as 'passport' | 'id_card' | 'driver_license' | 'other',
      document_number: documentNumber,
      document_issuer: faker.location.country(),
      document_expiry_date: DateTime.fromJSDate(faker.date.future({ years: 5 })),
      date_of_birth: DateTime.fromJSDate(birthDate),
      gender: faker.helpers.arrayElement(['male', 'female', 'other', null]),
      nationality,
      address: JSON.stringify({
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        country: faker.location.country(),
        postal_code: faker.location.zipCode(),
      }),
      preferences: {
        room_preference: faker.helpers.arrayElement(guestProfile.preferences.roomTypes),
        floor_preference: guestProfile.preferences.floorPreference,
        bed_preference: guestProfile.preferences.bedType,
        smoking_preference: guestProfile.preferences.smokingPreference,
        dietary_restrictions: (() => {
          const restrictions = {
            vip: ['gluten_free', 'kosher', 'halal', 'vegetarian', 'vegan'],
            corporate: ['vegetarian', 'vegan', 'gluten_free'],
            family: ['nut_allergy', 'lactose_intolerant', 'vegetarian'],
            regular: ['vegetarian', 'vegan'],
            firstTime: [],
          }
          const availableRestrictions = restrictions[guestType as keyof typeof restrictions] || []
          return faker.helpers.arrayElements(availableRestrictions, { min: 0, max: 2 })
        })(),
        special_requests: (() => {
          const requests = DataCorrelations.getSpecialRequests(guestType)
          const selectedRequest = faker.helpers.weightedArrayElement(
            requests.map((r) => ({ value: r.request, weight: r.probability * 100 }))
          )
          return faker.datatype.boolean({ probability: 0.3 }) ? selectedRequest : null
        })(),
        language: (() => {
          const languages = {
            vip: ['en', 'fr', 'de', 'ja', 'zh'],
            corporate: ['en', 'de', 'ja', 'zh'],
            family: ['en', 'es', 'pt'],
            regular: ['en', 'es', 'pt'],
            firstTime: ['en'],
          }
          return faker.helpers.arrayElement(
            languages[guestType as keyof typeof languages] || ['en']
          )
        })(),
      },
      loyalty_number:
        guestType === 'vip' ||
        (guestType === 'regular' && faker.datatype.boolean({ probability: 0.6 }))
          ? faker.string.alphanumeric({ length: 10, casing: 'upper' })
          : null,
      loyalty_points: (() => {
        const pointRanges = {
          vip: { min: 10000, max: 100000 },
          regular: { min: 1000, max: 10000 },
          corporate: { min: 2000, max: 20000 },
          family: { min: 500, max: 5000 },
          firstTime: { min: 0, max: 0 },
        }
        const range = pointRanges[guestType as keyof typeof pointRanges] || { min: 0, max: 1000 }
        return faker.number.int(range)
      })(),
      is_blacklisted: false,
      blacklist_reason: null,
      is_deleted: false,
      metadata: {
        // Guest type for future reference
        guest_type: guestType,

        // Stay history based on guest type
        total_stays: (() => {
          const stayRanges = {
            vip: { min: 20, max: 100 },
            regular: { min: 5, max: 20 },
            corporate: { min: 10, max: 50 },
            family: { min: 2, max: 10 },
            firstTime: { min: 0, max: 0 },
          }
          const range = stayRanges[guestType as keyof typeof stayRanges] || { min: 0, max: 5 }
          return faker.number.int(range)
        })(),

        // Total spent correlated with stays and guest type
        total_spent: (() => {
          const spendRanges = {
            vip: { min: 20000, max: 200000 },
            regular: { min: 2000, max: 20000 },
            corporate: { min: 5000, max: 50000 },
            family: { min: 1000, max: 15000 },
            firstTime: { min: 0, max: 0 },
          }
          const range = spendRanges[guestType as keyof typeof spendRanges] || { min: 0, max: 1000 }
          return faker.number.float({ ...range, fractionDigits: 2 })
        })(),

        // Average stay length based on guest profile
        average_stay_length: guestProfile.behavior.avgStayLength,

        // Last stay date - more recent for regular guests
        last_stay_date:
          guestType === 'firstTime'
            ? null
            : guestType === 'regular' || guestType === 'vip'
              ? faker.date.recent({ days: 90 })
              : faker.date.recent({ days: 180 }),

        // Acquisition source based on guest type
        source: (() => {
          const sources = {
            vip: ['direct', 'phone', 'referral'],
            corporate: ['corporate_portal', 'direct', 'phone'],
            family: ['booking.com', 'expedia', 'website'],
            regular: ['direct', 'website', 'phone'],
            firstTime: ['booking.com', 'expedia', 'google', 'social_media'],
          }
          return faker.helpers.arrayElement(
            sources[guestType as keyof typeof sources] || ['website']
          )
        })(),

        // Marketing consent higher for loyal guests
        marketing_consent:
          guestType === 'vip' || guestType === 'regular'
            ? faker.datatype.boolean({ probability: 0.8 })
            : faker.datatype.boolean({ probability: 0.4 }),

        // Additional metadata based on guest type
        tags: (() => {
          const tags = []
          if (guestType === 'vip') tags.push('vip', 'high_value')
          if (guestType === 'corporate') tags.push('business', 'corporate')
          if (guestType === 'family') tags.push('family', 'leisure')
          if (guestType === 'regular') tags.push('returning', 'loyal')
          if (guestType === 'firstTime') tags.push('new', 'first_time')
          return tags
        })(),

        // Service usage probability
        service_usage_score: guestProfile.behavior.serviceUsage,

        // Complaint history
        complaint_rate: guestProfile.behavior.complaintRate,

        // Tipping behavior
        average_tip_percentage: guestProfile.behavior.tipAmount * 100,
      },
    }
  })
  .state('vip', (guest, { faker }) => {
    guest.loyalty_number = faker.string.alphanumeric({ length: 10, casing: 'upper' })
    guest.loyalty_points = faker.number.int({ min: 50000, max: 200000 })
    guest.metadata.guest_type = 'vip'
    guest.metadata.total_stays = faker.number.int({ min: 50, max: 200 })
    guest.metadata.total_spent = faker.number.float({ min: 50000, max: 500000, fractionDigits: 2 })
    guest.metadata.tags = ['vip', 'frequent_guest', 'high_value', 'priority']
    guest.preferences.room_preference = faker.helpers.arrayElement(['presidential', 'penthouse'])
    guest.preferences.floor_preference = 'high'
    guest.metadata.preferred_staff = faker.helpers.arrayElements(['John', 'Mary', 'David'], {
      min: 1,
      max: 2,
    })
  })
  .state('regular', (guest, { faker }) => {
    guest.metadata.guest_type = 'regular'
    guest.metadata.total_stays = faker.number.int({ min: 10, max: 30 })
    guest.metadata.total_spent = faker.number.float({ min: 5000, max: 30000, fractionDigits: 2 })
    guest.metadata.tags = ['regular', 'returning_guest', 'loyal']
    guest.loyalty_number = faker.string.alphanumeric({ length: 10, casing: 'upper' })
    guest.loyalty_points = faker.number.int({ min: 2000, max: 15000 })
  })
  .state('corporate', (guest, { faker }) => {
    const company = faker.company.name()
    guest.email = faker.internet.email({
      firstName: guest.first_name,
      lastName: guest.last_name,
      provider: faker.helpers.slugify(company).toLowerCase() + '.com',
    })
    guest.metadata.guest_type = 'corporate'
    guest.metadata.tags = ['corporate', 'business', 'frequent_traveler']
    guest.metadata.company = company
    guest.metadata.corporate_id = faker.string.alphanumeric({ length: 8, casing: 'upper' })
    guest.metadata.corporate_rate_code =
      'CORP-' + faker.string.alphanumeric({ length: 4, casing: 'upper' })
    guest.preferences.special_requests = 'Invoice to company'
    guest.preferences.floor_preference = 'high'
    guest.metadata.expense_approval_required = faker.datatype.boolean({ probability: 0.3 })
  })
  .state('blacklisted', (guest, { faker }) => {
    guest.is_blacklisted = true
    guest.metadata.blacklist_reason = faker.helpers.arrayElement([
      'Payment issues',
      'Property damage',
      'Disturbing other guests',
      'Policy violations',
      'Fraud attempt',
    ])
    guest.metadata.blacklist_date = faker.date.recent({ days: 180 })
  })
  .state('firstTime', (guest) => {
    guest.metadata.guest_type = 'firstTime'
    guest.metadata.total_stays = 0
    guest.metadata.total_spent = 0
    guest.metadata.tags = ['first_time', 'new_guest', 'prospect']
    guest.metadata.acquisition_channel = 'organic_search'
    guest.metadata.referral_source = null
    guest.loyalty_number = null
    guest.loyalty_points = 0
  })
  .state('family', (guest, { faker }) => {
    guest.metadata.guest_type = 'family'
    guest.metadata.tags = ['family', 'leisure', 'group']
    guest.preferences.room_preference = faker.helpers.arrayElement([
      'suite',
      'family_room',
      'adjoining_rooms',
    ])
    guest.preferences.floor_preference = 'low' // Easier with kids
    guest.metadata.family_size = faker.number.int({ min: 3, max: 6 })
    guest.metadata.has_children = true
    guest.metadata.children_ages = Array.from(
      { length: faker.number.int({ min: 1, max: 3 }) },
      () => faker.number.int({ min: 1, max: 17 })
    )
    guest.metadata.requires_cribs = faker.datatype.boolean({ probability: 0.3 })
    guest.metadata.requires_high_chairs = faker.datatype.boolean({ probability: 0.4 })
    guest.preferences.special_requests = 'Child-friendly room setup'
  })
  .build()
