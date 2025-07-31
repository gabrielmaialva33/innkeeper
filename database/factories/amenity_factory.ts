import factory from '@adonisjs/lucid/factories'
import { FactoryContextContract } from '@adonisjs/lucid/types/factory'
import Amenity from '#models/amenity'

export const AmenityFactory = factory
  .define(Amenity, async ({ faker }: FactoryContextContract) => {
    const amenityCategories = {
      room: [
        { name: 'Wi-Fi', description: 'High-speed wireless internet access', icon: 'wifi' },
        { name: 'Air Conditioning', description: 'Climate control system', icon: 'ac' },
        { name: 'Mini Bar', description: 'In-room refreshment center', icon: 'minibar' },
        { name: 'Safe', description: 'In-room security safe', icon: 'safe' },
        { name: 'Coffee Maker', description: 'Coffee and tea making facilities', icon: 'coffee' },
        { name: 'Hair Dryer', description: 'Professional hair dryer', icon: 'hairdryer' },
        { name: 'Iron & Board', description: 'Iron and ironing board', icon: 'iron' },
        { name: 'Bathrobe', description: 'Luxury bathrobes', icon: 'bathrobe' },
        { name: 'Slippers', description: 'Complimentary slippers', icon: 'slippers' },
        { name: 'Smart TV', description: 'Smart TV with streaming services', icon: 'tv' },
      ],
      hotel: [
        { name: 'Swimming Pool', description: 'Outdoor swimming pool', icon: 'pool' },
        { name: 'Fitness Center', description: '24-hour fitness center', icon: 'gym' },
        { name: 'Spa', description: 'Full-service spa and wellness center', icon: 'spa' },
        { name: 'Restaurant', description: 'On-site dining restaurant', icon: 'restaurant' },
        { name: 'Bar', description: 'Lobby bar and lounge', icon: 'bar' },
        { name: 'Business Center', description: '24-hour business center', icon: 'business' },
        { name: 'Parking', description: 'On-site parking facility', icon: 'parking' },
        { name: 'Airport Shuttle', description: 'Complimentary airport shuttle', icon: 'shuttle' },
        { name: 'Concierge', description: 'Concierge services', icon: 'concierge' },
        { name: 'Laundry Service', description: 'Laundry and dry cleaning', icon: 'laundry' },
      ],
      accessibility: [
        {
          name: 'Wheelchair Access',
          description: 'Wheelchair accessible areas',
          icon: 'wheelchair',
        },
        { name: 'Elevator', description: 'Elevator access to all floors', icon: 'elevator' },
        {
          name: 'Accessible Bathroom',
          description: 'ADA compliant bathrooms',
          icon: 'accessible_bath',
        },
        {
          name: 'Braille Signage',
          description: 'Braille room numbers and signage',
          icon: 'braille',
        },
      ],
      business: [
        {
          name: 'Meeting Rooms',
          description: 'Conference and meeting facilities',
          icon: 'meeting',
        },
        { name: 'Conference Hall', description: 'Large conference hall', icon: 'conference' },
        { name: 'Projector', description: 'Presentation equipment', icon: 'projector' },
        {
          name: 'Video Conference',
          description: 'Video conferencing facilities',
          icon: 'video_conf',
        },
      ],
      entertainment: [
        { name: 'Beach Access', description: 'Direct beach access', icon: 'beach' },
        { name: 'Tennis Court', description: 'Tennis courts', icon: 'tennis' },
        { name: 'Golf Course', description: 'On-site golf course', icon: 'golf' },
        { name: 'Kids Club', description: "Children's activity center", icon: 'kids' },
        { name: 'Game Room', description: 'Recreation and game room', icon: 'games' },
      ],
    }

    const category = faker.helpers.objectKey(amenityCategories) as keyof typeof amenityCategories
    const amenityData = faker.helpers.arrayElement(amenityCategories[category])

    return {
      organization_id: 0, // Will be set by relation
      name: amenityData.name,
      code: faker.helpers.slugify(amenityData.name).toLowerCase(),
      description: amenityData.description,
      category,
      icon: amenityData.icon,
      is_active: faker.datatype.boolean({ probability: 0.95 }),
      metadata: {
        display_order: faker.number.int({ min: 1, max: 100 }),
        requires_booking: ['Spa', 'Tennis Court', 'Golf Course', 'Meeting Rooms'].includes(
          amenityData.name
        ),
        additional_cost: faker.datatype.boolean({ probability: 0.3 }),
        cost_amount: faker.datatype.boolean({ probability: 0.3 })
          ? faker.number.float({ min: 10, max: 200, fractionDigits: 2 })
          : null,
        operating_hours: [
          'Swimming Pool',
          'Fitness Center',
          'Spa',
          'Restaurant',
          'Bar',
          'Business Center',
        ].includes(amenityData.name)
          ? {
              open: faker.helpers.arrayElement(['06:00', '07:00', '08:00', '09:00']),
              close: faker.helpers.arrayElement(['20:00', '21:00', '22:00', '23:00', '00:00']),
            }
          : null,
        capacity: ['Meeting Rooms', 'Conference Hall', 'Swimming Pool', 'Fitness Center'].includes(
          amenityData.name
        )
          ? faker.number.int({ min: 10, max: 200 })
          : null,
        age_restriction: ['Bar', 'Spa', 'Fitness Center'].includes(amenityData.name)
          ? faker.helpers.arrayElement([16, 18, 21])
          : null,
        seasonal: ['Swimming Pool', 'Beach Access', 'Tennis Court'].includes(amenityData.name)
          ? faker.datatype.boolean({ probability: 0.3 })
          : false,
      },
    }
  })
  .state('premium', (amenity, { faker }) => {
    amenity.metadata.additional_cost = true
    amenity.metadata.cost_amount = faker.number.float({ min: 50, max: 500, fractionDigits: 2 })
    amenity.metadata.premium_feature = true
    amenity.metadata.included_in_packages = ['luxury', 'presidential']
  })
  .state('complimentary', (amenity) => {
    amenity.metadata.additional_cost = false
    amenity.metadata.cost_amount = null
    amenity.metadata.included_for_all_guests = true
  })
  .state('seasonal', (amenity, { faker }) => {
    amenity.metadata.seasonal = true
    amenity.metadata.season_start = faker.helpers.arrayElement(['May', 'June'])
    amenity.metadata.season_end = faker.helpers.arrayElement(['September', 'October'])
    amenity.metadata.weather_dependent = true
  })
  .state('businessFocused', (amenity, { faker }) => {
    amenity.category = 'business'
    amenity.name = faker.helpers.arrayElement([
      'Meeting Room',
      'Conference Center',
      'Business Lounge',
    ])
    amenity.code = faker.helpers.slugify(amenity.name).toLowerCase()
    amenity.description = `Professional ${amenity.name.toLowerCase()} for business travelers`
    amenity.metadata.capacity = faker.number.int({ min: 10, max: 100 })
    amenity.metadata.equipment_included = [
      'Projector',
      'Screen',
      'Video Conference',
      'Whiteboard',
      'Sound System',
    ]
  })
  .build()
