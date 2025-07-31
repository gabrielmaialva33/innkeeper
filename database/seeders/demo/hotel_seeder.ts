import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Organization from '#models/organization'
import { HotelFactory } from '#database/factories/hotel_factory'
import { RoomTypeFactory } from '#database/factories/room_type_factory'
import { RoomFactory } from '#database/factories/room_factory'
import Amenity from '#models/amenity'
import logger from '@adonisjs/core/services/logger'

export default class extends BaseSeeder {
  static environment = ['development']

  async run() {
    logger.info('Creating demo hotels...')

    const organizations = await Organization.all()

    for (const org of organizations) {
      logger.info(`  Creating hotels for ${org.name}...`)

      // Define different hotel types based on organization
      const hotelConfigs =
        org.slug === 'demo-hotels'
          ? [
              { state: 'cityHotel', roomTypes: 5, roomsPerType: 15 },
              { state: 'beachResort', roomTypes: 7, roomsPerType: 20 },
              { state: 'businessHotel', roomTypes: 4, roomsPerType: 25 },
            ]
          : [
              { state: 'boutiqueHotel', roomTypes: 3, roomsPerType: 8 },
              { state: 'luxuryHotel', roomTypes: 6, roomsPerType: 12 },
            ]

      for (const config of hotelConfigs) {
        // Create hotel with specific state
        const hotel = await HotelFactory.merge({ organization_id: org.id })
          .apply(config.state as any)
          .create()

        // Cria tipos de quarto variados
        const roomTypeStates = ['standard', 'deluxe', 'suite', 'presidential', 'economy']
        const roomTypes = []

        for (let i = 0; i < config.roomTypes; i++) {
          const roomType = await RoomTypeFactory.merge({
            hotel_id: hotel.id,
            organization_id: org.id,
          })
            .apply(roomTypeStates[i % roomTypeStates.length] as any)
            .create()

          roomTypes.push(roomType)

          // Create rooms for each type
          const roomStates = ['clean', 'occupied', 'maintenance']
          for (let j = 0; j < config.roomsPerType; j++) {
            await RoomFactory.merge({
              organization_id: org.id,
              hotel_id: hotel.id,
              room_type_id: roomType.id,
              room_number: `${i + 1}${String(j + 1).padStart(2, '0')}`,
              floor: String(Math.floor(j / 10) + 1),
            })
              .apply(j % 10 === 0 ? (roomStates[j % roomStates.length] as any) : 'clean')
              .create()
          }
        }

        // Associate amenities to hotel
        const hotelAmenities = await Amenity.query()
          .where('category', 'hotel')
          .orderByRaw('RANDOM()')
          .limit(Math.floor(Math.random() * 5) + 5)

        if (hotelAmenities.length > 0) {
          await hotel.related('amenities').attach(hotelAmenities.map((a) => a.id))
        }

        // Associate amenities to room types
        const roomAmenities = await Amenity.query().whereIn('category', [
          'room',
          'bathroom',
          'kitchen',
        ])

        for (const roomType of roomTypes) {
          const selectedAmenities = roomAmenities
            .sort(() => Math.random() - 0.5)
            .slice(0, Math.floor(Math.random() * 8) + 5)

          if (selectedAmenities.length > 0) {
            await roomType.related('amenities').attach(selectedAmenities.map((a) => a.id))
          }
        }

        logger.info(
          `    ✓ Hotel ${hotel.name} created with ${roomTypes.length} room types and ${config.roomTypes * config.roomsPerType} rooms`
        )
      }
    }

    logger.info('✓ Demo hotels created successfully')
  }
}
