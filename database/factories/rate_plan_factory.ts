import factory from '@adonisjs/lucid/factories'
import RatePlan from '#models/rate_plan'

export const RatePlanFactory = factory
  .define(RatePlan, async ({ faker }) => {
    // Define rate plan types with realistic characteristics
    const rateTypes = [
      {
        type: 'bar' as const,
        name: 'Best Available Rate',
        code: 'BAR',
        cancellation_policy: 'flexible' as const,
        commission_percentage: 15,
        advance_booking_days: 0,
        includes_breakfast: false,
        is_public: true,
        priority: 1,
      },
      {
        type: 'corporate' as const,
        name: () => `${faker.company.name()} Corporate Rate`,
        code: () => `CORP-${faker.string.alphanumeric(4).toUpperCase()}`,
        cancellation_policy: 'moderate' as const,
        commission_percentage: 10,
        advance_booking_days: 0,
        includes_breakfast: true,
        is_public: false,
        priority: 2,
      },
      {
        type: 'package' as const,
        name: () =>
          faker.helpers.arrayElement([
            'Weekend Getaway Package',
            'Romance Package',
            'Family Fun Package',
            'Business Traveler Package',
            'Spa & Wellness Package',
          ]),
        code: () => `PKG-${faker.string.alphanumeric(4).toUpperCase()}`,
        cancellation_policy: 'strict' as const,
        commission_percentage: 20,
        advance_booking_days: 7,
        includes_breakfast: true,
        is_public: true,
        priority: 3,
      },
      {
        type: 'promotional' as const,
        name: () =>
          faker.helpers.arrayElement([
            'Early Bird Special',
            'Last Minute Deal',
            'Summer Sale',
            'Winter Special',
            'Flash Sale',
          ]),
        code: () => `PROMO-${faker.string.alphanumeric(4).toUpperCase()}`,
        cancellation_policy: 'non_refundable' as const,
        commission_percentage: 25,
        advance_booking_days: 14,
        includes_breakfast: faker.datatype.boolean(),
        is_public: true,
        priority: 4,
      },
      {
        type: 'government' as const,
        name: 'Government Rate',
        code: 'GOV',
        cancellation_policy: 'flexible' as const,
        commission_percentage: 0,
        advance_booking_days: 0,
        includes_breakfast: false,
        is_public: false,
        priority: 5,
      },
      {
        type: 'group' as const,
        name: () => `${faker.company.name()} Group Rate`,
        code: () => `GRP-${faker.string.alphanumeric(4).toUpperCase()}`,
        cancellation_policy: 'moderate' as const,
        commission_percentage: 12,
        advance_booking_days: 30,
        includes_breakfast: true,
        is_public: false,
        priority: 6,
      },
    ]

    const selectedType = faker.helpers.arrayElement(rateTypes)

    // Generate restrictions based on rate type
    const restrictions = {
      days_of_week:
        selectedType.type === 'package' && faker.datatype.boolean(0.3)
          ? [5, 6] // Weekend only for some packages
          : [0, 1, 2, 3, 4, 5, 6], // All days
      booking_channels:
        selectedType.type === 'corporate' || selectedType.type === 'government'
          ? ['direct', 'gds']
          : selectedType.type === 'promotional'
            ? ['direct', 'ota']
            : ['direct', 'ota', 'gds', 'meta'],
      guest_types:
        selectedType.type === 'corporate'
          ? ['business', 'corporate']
          : selectedType.type === 'government'
            ? ['government']
            : ['leisure', 'business', 'group', 'corporate'],
      markets:
        selectedType.type === 'promotional'
          ? faker.helpers.arrayElements(['domestic', 'international', 'regional'], {
              min: 1,
              max: 2,
            })
          : ['domestic', 'international', 'regional'],
    }

    return {
      name: typeof selectedType.name === 'function' ? selectedType.name() : selectedType.name,
      code: typeof selectedType.code === 'function' ? selectedType.code() : selectedType.code,
      description: faker.lorem.sentence(),
      type: selectedType.type,
      is_active: faker.datatype.boolean(0.9), // 90% active
      is_public: selectedType.is_public,
      priority: selectedType.priority,
      min_stay: selectedType.type === 'package' ? faker.number.int({ min: 2, max: 3 }) : 1,
      max_stay: selectedType.type === 'promotional' ? faker.number.int({ min: 7, max: 14 }) : null,
      advance_booking_days: selectedType.advance_booking_days,
      cancellation_policy: selectedType.cancellation_policy,
      includes_breakfast:
        typeof selectedType.includes_breakfast === 'boolean'
          ? selectedType.includes_breakfast
          : selectedType.includes_breakfast,
      commission_percentage: selectedType.commission_percentage,
      is_deleted: false,
      restrictions,
      metadata: {
        created_via: 'factory',
        rate_type_category: selectedType.type,
        yield_management_enabled: selectedType.type === 'bar',
      },
    }
  })
  .state('bar', (plan) => {
    plan.type = 'bar'
    plan.name = 'Best Available Rate'
    plan.code = 'BAR'
    plan.cancellation_policy = 'flexible'
    plan.is_public = true
    plan.priority = 1
  })
  .state('corporate', (plan) => {
    plan.type = 'corporate'
    plan.cancellation_policy = 'moderate'
    plan.includes_breakfast = true
    plan.is_public = false
    plan.priority = 2
  })
  .state('package', (plan) => {
    plan.type = 'package'
    plan.cancellation_policy = 'strict'
    plan.includes_breakfast = true
    plan.min_stay = 2
    plan.priority = 3
  })
  .state('promotional', (plan) => {
    plan.type = 'promotional'
    plan.cancellation_policy = 'non_refundable'
    plan.advance_booking_days = 14
    plan.priority = 4
  })
  .state('nonRefundable', (plan) => {
    plan.cancellation_policy = 'non_refundable'
    plan.commission_percentage = 25
  })
  .state('weekendOnly', (plan) => {
    plan.restrictions = {
      ...plan.restrictions,
      days_of_week: [5, 6], // Friday and Saturday
    }
    plan.min_stay = 2
  })
  .state('longStay', (plan) => {
    plan.min_stay = 7
    plan.commission_percentage = Math.max(plan.commission_percentage - 5, 0)
    plan.name = `Long Stay ${plan.name}`
  })
  .build()
