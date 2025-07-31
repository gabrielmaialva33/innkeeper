import factory from '@adonisjs/lucid/factories'
import { FactoryContextContract } from '@adonisjs/lucid/types/factory'
import Service from '#models/service'

export const ServiceFactory = factory
  .define(Service, async ({ faker }: FactoryContextContract) => {
    const serviceCategories = {
      food_beverage: [
        {
          name: 'Breakfast in Bed',
          description: 'Continental breakfast delivered to your room',
          basePrice: 35,
        },
        {
          name: 'Room Service - Lunch',
          description: 'Lunch menu available 11am-3pm',
          basePrice: 45,
        },
        {
          name: 'Room Service - Dinner',
          description: 'Dinner menu available 6pm-11pm',
          basePrice: 65,
        },
        { name: 'Late Night Snacks', description: 'Light meals available 11pm-5am', basePrice: 25 },
        { name: 'Champagne Service', description: 'Premium champagne selection', basePrice: 120 },
      ],
      laundry: [
        { name: 'Laundry Service', description: 'Same day laundry service', basePrice: 50 },
        { name: 'Dry Cleaning', description: 'Professional dry cleaning', basePrice: 75 },
        { name: 'Shoe Shine', description: 'Professional shoe shine service', basePrice: 15 },
        { name: 'Express Laundry', description: 'Express laundry service', basePrice: 100 },
      ],
      spa_wellness: [
        { name: 'Swedish Massage', description: '60-minute relaxation massage', basePrice: 150 },
        {
          name: 'Deep Tissue Massage',
          description: '90-minute therapeutic massage',
          basePrice: 200,
        },
        { name: 'Facial Treatment', description: 'Rejuvenating facial treatment', basePrice: 120 },
        { name: 'Manicure & Pedicure', description: 'Professional nail care', basePrice: 80 },
        {
          name: 'Couples Spa Package',
          description: 'Romantic spa experience for two',
          basePrice: 400,
        },
        { name: 'Yoga Session', description: 'Private yoga instruction', basePrice: 75 },
      ],
      transportation: [
        { name: 'Airport Transfer', description: 'One-way airport transportation', basePrice: 60 },
        { name: 'City Tour', description: 'Guided city tour (4 hours)', basePrice: 120 },
        { name: 'Car Rental', description: 'Daily car rental service', basePrice: 150 },
        { name: 'Limousine Service', description: 'Luxury limousine by the hour', basePrice: 200 },
        { name: 'Bicycle Rental', description: 'Daily bicycle rental', basePrice: 25 },
        { name: 'Valet Parking', description: 'Valet parking service', basePrice: 30 },
      ],
      business: [
        { name: 'Printing & Copying', description: 'Business document services', basePrice: 20 },
        {
          name: 'Secretary Service',
          description: 'Professional secretary assistance',
          basePrice: 100,
        },
        {
          name: 'Translation Service',
          description: 'Document translation services',
          basePrice: 150,
        },
        {
          name: 'Equipment Rental',
          description: 'Laptop, projector, and AV equipment',
          basePrice: 75,
        },
        { name: 'Meeting Package', description: 'Complete meeting room setup', basePrice: 300 },
      ],
      entertainment: [
        {
          name: 'Restaurant Reservations',
          description: 'Exclusive restaurant bookings',
          basePrice: 0,
        },
        {
          name: 'Event Tickets',
          description: 'Theater, concert, and sports tickets',
          basePrice: 25,
        },
        { name: 'Personal Shopping', description: 'Personal shopping assistant', basePrice: 100 },
        { name: 'Tour Guide', description: 'Private tour guide service', basePrice: 200 },
        {
          name: 'Flowers & Gifts',
          description: 'Flower arrangements and gift delivery',
          basePrice: 50,
        },
      ],
      other: [
        { name: 'Birthday Package', description: 'Birthday celebration setup', basePrice: 150 },
        {
          name: 'Anniversary Package',
          description: 'Romantic anniversary arrangement',
          basePrice: 250,
        },
        { name: 'Honeymoon Package', description: 'Complete honeymoon experience', basePrice: 500 },
        { name: 'Proposal Setup', description: 'Romantic proposal arrangement', basePrice: 1000 },
        { name: 'Baby Welcome', description: 'Baby amenities and setup', basePrice: 100 },
      ],
    }

    const category = faker.helpers.objectKey(serviceCategories) as keyof typeof serviceCategories
    const serviceData = faker.helpers.arrayElement(serviceCategories[category])

    return {
      organization_id: 0, // Will be set by relation
      hotel_id: null, // Will be set by relation if hotel-specific
      name: serviceData.name,
      code: faker.helpers.slugify(serviceData.name).toLowerCase(),
      description: serviceData.description,
      category,
      unit_price:
        serviceData.basePrice + faker.number.float({ min: -10, max: 50, fractionDigits: 2 }),
      currency: 'USD',
      unit_type: faker.helpers.arrayElement([
        'per_person',
        'per_room',
        'per_hour',
        'per_day',
        'per_item',
        'fixed',
      ]) as 'per_person' | 'per_room' | 'per_hour' | 'per_day' | 'per_item' | 'fixed',
      is_taxable: faker.datatype.boolean({ probability: 0.8 }),
      tax_rate: faker.datatype.boolean({ probability: 0.8 }) ? 0.1 : 0,
      is_active: faker.datatype.boolean({ probability: 0.95 }),
      requires_advance_booking: faker.datatype.boolean({ probability: 0.6 }),
      advance_booking_hours: faker.datatype.boolean({ probability: 0.6 })
        ? faker.helpers.arrayElement([2, 4, 6, 12, 24, 48])
        : 0,
      is_available_24h: faker.datatype.boolean({ probability: 0.3 }),
      available_from: faker.datatype.boolean({ probability: 0.7 })
        ? faker.helpers.arrayElement(['06:00', '07:00', '08:00', '09:00'])
        : null,
      available_until: faker.datatype.boolean({ probability: 0.7 })
        ? faker.helpers.arrayElement(['18:00', '20:00', '22:00', '23:00'])
        : null,
      max_quantity_per_day: faker.helpers.weightedArrayElement([
        { value: null, weight: 60 },
        { value: 1, weight: 20 },
        { value: 5, weight: 15 },
        { value: 10, weight: 5 },
      ]),
      is_deleted: false,
      metadata: {
        duration_minutes: ['massage', 'facial', 'spa', 'tour', 'yoga'].some((word) =>
          serviceData.name.toLowerCase().includes(word)
        )
          ? faker.helpers.arrayElement([30, 60, 90, 120, 240])
          : null,
        advance_booking_required: faker.datatype.boolean({ probability: 0.4 }),
        advance_booking_hours: faker.datatype.boolean({ probability: 0.4 })
          ? faker.helpers.arrayElement([2, 4, 6, 12, 24, 48])
          : null,
        availability_schedule: {
          monday: { available: true, start: '09:00', end: '18:00' },
          tuesday: { available: true, start: '09:00', end: '18:00' },
          wednesday: { available: true, start: '09:00', end: '18:00' },
          thursday: { available: true, start: '09:00', end: '18:00' },
          friday: { available: true, start: '09:00', end: '18:00' },
          saturday: { available: true, start: '10:00', end: '16:00' },
          sunday: {
            available: faker.datatype.boolean({ probability: 0.7 }),
            start: '10:00',
            end: '16:00',
          },
        },
        popular_times: faker.helpers.arrayElements(
          ['morning', 'afternoon', 'evening', 'late_night'],
          { min: 1, max: 2 }
        ),
        average_rating: faker.number.float({ min: 3.5, max: 5.0, fractionDigits: 1 }),
        total_bookings: faker.number.int({ min: 0, max: 1000 }),
        commission_rate:
          category === 'entertainment'
            ? faker.number.float({ min: 0.1, max: 0.3, fractionDigits: 2 })
            : null,
        provider: ['spa_wellness', 'transportation', 'business'].includes(category)
          ? faker.company.name()
          : null,
        cancellation_policy: faker.helpers.arrayElement([
          'Free cancellation up to 24 hours',
          'Free cancellation up to 48 hours',
          '50% refund if cancelled 24 hours before',
          'Non-refundable',
        ]),
        included_items: faker.helpers.arrayElements(
          ['Equipment', 'Materials', 'Refreshments', 'Transportation', 'Guide', 'Insurance'],
          { min: 0, max: 3 }
        ),
      },
    }
  })
  .state('complimentary', (service) => {
    service.unit_price = 0
    service.is_taxable = false
    service.tax_rate = 0
    service.metadata.complimentary = true
    service.metadata.included_in_room_types = ['suite', 'presidential']
  })
  .state('premium', (service) => {
    service.unit_price = service.unit_price * 1.5
    service.metadata.premium_service = true
    service.metadata.includes_extras = true
    service.metadata.priority_booking = true
    service.metadata.dedicated_staff = true
  })
  .state('seasonal', (service, { faker }) => {
    service.metadata.seasonal = true
    service.metadata.available_months = faker.helpers.arrayElements(
      ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      { min: 3, max: 6 }
    )
    service.metadata.seasonal_pricing = {
      peak_season_multiplier: 1.5,
      off_season_multiplier: 0.8,
    }
  })
  .state('popular', (service, { faker }) => {
    service.metadata.is_featured = true
    service.metadata.average_rating = faker.number.float({ min: 4.5, max: 5.0, fractionDigits: 1 })
    service.metadata.total_bookings = faker.number.int({ min: 500, max: 5000 })
    service.metadata.repeat_customer_rate = faker.number.float({
      min: 0.6,
      max: 0.9,
      fractionDigits: 2,
    })
  })
  .state('package', (service, { faker }) => {
    service.name = faker.helpers.arrayElement([
      'Romance Package',
      'Family Fun Package',
      'Business Traveler Package',
      'Wellness Retreat Package',
      'Adventure Package',
    ])
    service.code = faker.helpers.slugify(service.name).toLowerCase()
    service.category = 'other'
    service.unit_price = faker.number.float({ min: 200, max: 1000, fractionDigits: 2 })
    service.metadata.package_includes = faker.helpers.arrayElements(
      [
        'Welcome amenities',
        'Daily breakfast',
        'Spa credit',
        'Late checkout',
        'Room upgrade',
        'Complimentary minibar',
        'Airport transfer',
        'Guided tour',
      ],
      { min: 3, max: 6 }
    )
    service.metadata.minimum_nights = faker.helpers.arrayElement([2, 3, 5, 7])
  })
  .before('create', async (_factory, service) => {
    // Ensure price is not negative
    if (service.unit_price < 0) {
      service.unit_price = 0
    }

    // Set tax amount if taxable
    if (service.is_taxable && service.tax_rate > 0) {
      service.metadata.tax_amount = service.unit_price * service.tax_rate
    }
  })
  .build()
