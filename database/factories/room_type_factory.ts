import factory from '@adonisjs/lucid/factories'
import { FactoryContextContract } from '@adonisjs/lucid/types/factory'
import RoomType from '#models/room_type'
import { HotelFactory } from './hotel_factory.js'

export const RoomTypeFactory = factory
  .define(RoomType, async ({ faker }: FactoryContextContract) => {
    const roomCategories = {
      standard: {
        names: ['Standard Room', 'Classic Room', 'Economy Room'],
        occupancy: { min: 1, max: 2 },
        basePrice: { min: 80, max: 150 },
        size: { min: 20, max: 30 },
      },
      deluxe: {
        names: ['Deluxe Room', 'Superior Room', 'Premium Room'],
        occupancy: { min: 2, max: 3 },
        basePrice: { min: 150, max: 300 },
        size: { min: 30, max: 45 },
      },
      suite: {
        names: ['Junior Suite', 'Executive Suite', 'Family Suite'],
        occupancy: { min: 2, max: 4 },
        basePrice: { min: 300, max: 600 },
        size: { min: 45, max: 80 },
      },
      presidential: {
        names: ['Presidential Suite', 'Penthouse Suite', 'Royal Suite'],
        occupancy: { min: 2, max: 6 },
        basePrice: { min: 600, max: 2000 },
        size: { min: 80, max: 200 },
      },
    }

    const categoryKey = faker.helpers.objectKey(roomCategories)
    const category = roomCategories[categoryKey]
    const name = faker.helpers.arrayElement(category.names)

    return {
      organization_id: 0, // Will be set by relation
      hotel_id: 0, // Will be set by relation
      name,
      code: faker.helpers.slugify(name).toUpperCase().replace(/-/g, '_'),
      description: faker.lorem.paragraph(2),
      max_occupancy: faker.number.int(category.occupancy),
      base_price: faker.number.float({
        min: category.basePrice.min,
        max: category.basePrice.max,
        fractionDigits: 2,
      }),
      max_adults: faker.number.int({ min: 1, max: category.occupancy.max }),
      max_children: faker.number.int({ min: 0, max: 2 }),
      extra_bed_price: faker.datatype.boolean({ probability: 0.7 }) 
        ? faker.number.float({ min: 20, max: 50, fractionDigits: 2 })
        : null,
      size_sqm: faker.number.int(category.size),
      bed_type: faker.helpers.arrayElement(['king', 'queen', 'twin', 'double']),
      bed_count: faker.number.int({ min: 1, max: 2 }),
      view_type: faker.helpers.arrayElement(['city', 'ocean', 'garden', 'pool', 'mountain', null]),
      is_active: true,
      is_deleted: false,
      images: Array.from({ length: faker.number.int({ min: 3, max: 6 }) }, () =>
        faker.image.urlLoremFlickr({ category: 'hotel,room' })
      ),
      metadata: {
        amenities: faker.helpers.arrayElements(
          [
            'king_bed',
            'queen_bed',
            'twin_beds',
            'sofa_bed',
            'air_conditioning',
            'heating',
            'mini_bar',
            'safe',
            'coffee_maker',
            'hair_dryer',
            'iron',
            'bathtub',
            'shower',
            'bathrobe',
            'slippers',
            'work_desk',
            'flat_screen_tv',
            'cable_channels',
            'telephone',
            'high_speed_internet',
            'balcony',
            'ocean_view',
            'city_view',
            'garden_view',
            'soundproof',
            'hypoallergenic',
          ],
          { min: 8, max: 20 }
        ),
        size_in_sqm: faker.number.int(category.size),
        size_in_sqft: Math.round(faker.number.int(category.size) * 10.764),
        bed_configuration: faker.helpers.arrayElement([
          '1 King Bed',
          '2 Queen Beds',
          '2 Twin Beds',
          '1 King + 1 Sofa Bed',
          '1 Queen + 2 Twin Beds',
        ]),
        view_type: faker.helpers.arrayElement([
          'ocean',
          'city',
          'garden',
          'pool',
          'mountain',
          'courtyard',
        ]),
        floor: faker.helpers.arrayElement(['lower', 'middle', 'upper', 'any']),
        smoking_allowed: faker.datatype.boolean({ probability: 0.1 }),
      },
      is_active: true,
    }
  })
  .relation('hotel', () => HotelFactory)
  .state('standard', (roomType, { faker }) => {
    roomType.name = faker.helpers.arrayElement(['Standard Room', 'Classic Room', 'Economy Room'])
    roomType.max_occupancy = faker.number.int({ min: 1, max: 2 })
    roomType.base_price = faker.number.float({ min: 80, max: 150, fractionDigits: 2 })
    roomType.metadata.size_in_sqm = faker.number.int({ min: 20, max: 30 })
  })
  .state('deluxe', (roomType, { faker }) => {
    roomType.name = faker.helpers.arrayElement(['Deluxe Room', 'Superior Room', 'Premium Room'])
    roomType.max_occupancy = faker.number.int({ min: 2, max: 3 })
    roomType.base_price = faker.number.float({ min: 150, max: 300, fractionDigits: 2 })
    roomType.metadata.size_in_sqm = faker.number.int({ min: 30, max: 45 })
    roomType.metadata.amenities.push('mini_bar', 'bathrobe', 'slippers')
  })
  .state('suite', (roomType, { faker }) => {
    roomType.name = faker.helpers.arrayElement(['Junior Suite', 'Executive Suite', 'Family Suite'])
    roomType.max_occupancy = faker.number.int({ min: 2, max: 4 })
    roomType.base_price = faker.number.float({ min: 300, max: 600, fractionDigits: 2 })
    roomType.metadata.size_in_sqm = faker.number.int({ min: 45, max: 80 })
    roomType.metadata.amenities.push(
      'living_area',
      'dining_area',
      'kitchenette',
      'espresso_machine'
    )
  })
  .state('presidential', (roomType, { faker }) => {
    roomType.name = faker.helpers.arrayElement([
      'Presidential Suite',
      'Penthouse Suite',
      'Royal Suite',
    ])
    roomType.max_occupancy = faker.number.int({ min: 4, max: 6 })
    roomType.base_price = faker.number.float({ min: 1000, max: 5000, fractionDigits: 2 })
    roomType.metadata.size_in_sqm = faker.number.int({ min: 100, max: 300 })
    roomType.metadata.amenities = [
      'king_bed',
      'living_area',
      'dining_area',
      'full_kitchen',
      'jacuzzi',
      'private_balcony',
      'butler_service',
      'premium_minibar',
      'home_theater',
      'office_space',
      'guest_bathroom',
      'walk_in_closet',
      'panoramic_view',
      'private_elevator',
      'grand_piano',
    ]
  })
  .state('accessible', (roomType) => {
    roomType.name += ' - Accessible'
    roomType.metadata.amenities.push(
      'wheelchair_accessible',
      'grab_bars',
      'roll_in_shower',
      'lowered_fixtures'
    )
    roomType.metadata.accessibility_features = [
      'Wide doorways',
      'Lowered light switches',
      'Accessible bathroom',
      'Visual and auditory alerts',
    ]
  })
  .build()
