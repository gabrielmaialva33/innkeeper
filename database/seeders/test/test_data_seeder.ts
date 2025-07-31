import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { OrganizationFactory } from '#database/factories/organization_factory'
import { HotelFactory } from '#database/factories/hotel_factory'
import { RoomTypeFactory } from '#database/factories/room_type_factory'
import { RoomFactory } from '#database/factories/room_factory'
import { GuestFactory } from '#database/factories/guest_factory'
import { UserFactory } from '#database/factories/user_factory'
import { StaffFactory } from '#database/factories/staff_factory'
import { ReservationFactory } from '#database/factories/reservation_factory'
import Amenity from '#models/amenity'
import Service from '#models/service'
import logger from '@adonisjs/core/services/logger'

export default class extends BaseSeeder {
  static environment = ['testing']

  async run() {
    logger.info('Creating test data...')

    // Test organization
    const org = await OrganizationFactory.merge({
      slug: 'test-org',
      name: 'Test Organization',
      email: 'admin@test-org.com',
      settings: {
        overbooking_percentage: 5,
        default_check_in_time: '15:00',
        default_check_out_time: '11:00',
        cancellation_policy: 'flexible',
        payment_methods: ['credit_card', 'cash'],
        supported_languages: ['en'],
        night_audit_time: '03:00',
      },
    }).create()

    logger.info(`  ✓ Created test organization: ${org.name}`)

    // Admin user for tests
    const adminUser = await UserFactory.merge({
      organization_id: org.id,
      email: 'admin@test.com',
      username: 'admin_test',
      full_name: 'Test Administrator',
      password: 'test123', // Hash automatic by model
    }).create()

    logger.info(`  ✓ Created admin user: ${adminUser.email}`)

    // Staff user for tests
    const staffMember = await StaffFactory.merge({
      organization_id: org.id,
      department: 'front_desk',
      position: 'Front Desk Agent',
    }).create()

    const staffUser = await UserFactory.merge({
      organization_id: org.id,
      email: 'staff@test.com',
      username: 'staff_test',
      full_name: 'Test Staff',
      password: 'test123',
    }).create()

    staffMember.user_id = staffUser.id
    await staffMember.save()

    logger.info(`  ✓ Created staff user: ${staffUser.email}`)

    // Hotel with minimal but complete structure
    const hotel = await HotelFactory.merge({
      organization_id: org.id,
      name: 'Test Hotel',
    }).create()

    // Associate staff to hotel
    await staffMember.related('hotels').attach({
      [hotel.id]: {
        is_primary: true,
        started_at: staffMember.hire_date.toSQL(),
      },
    })

    // Create basic amenities if they don't exist
    const basicAmenities = ['wifi', 'parking', 'ac']
    for (const code of basicAmenities) {
      await Amenity.firstOrCreate(
        { code },
        {
          name: code.toUpperCase(),
          category: code === 'parking' ? 'hotel' : 'room',
          icon: code,
          description: `${code} amenity`,
          is_active: true,
          metadata: {},
        }
      )
    }

    // Associate amenities to hotel
    const hotelAmenity = await Amenity.findBy('code', 'parking')
    if (hotelAmenity) {
      await hotel.related('amenities').attach([hotelAmenity.id])
    }

    // Create basic services
    await Service.firstOrCreate(
      {
        organization_id: org.id,
        code: 'room-service-test',
      },
      {
        organization_id: org.id,
        hotel_id: hotel.id,
        name: 'Test Room Service',
        code: 'room-service-test',
        description: 'Test room service',
        category: 'food_beverage',
        unit_price: 50,
        unit_type: 'per_item',
        tax_rate: 0.1,
        is_taxable: true,
        is_active: true,
        is_deleted: false,
        is_available_24_h: true,
        available_from: null,
        available_until: null,
        max_quantity_per_day: null,
        requires_advance_booking: false,
        advance_booking_hours: 0,
        metadata: {},
      }
    )

    // Room types
    const standardRoom = await RoomTypeFactory.merge({
      hotel_id: hotel.id,
      organization_id: org.id,
      name: 'Standard Test Room',
      code: 'STD-TEST',
    })
      .apply('standard')
      .create()

    const deluxeRoom = await RoomTypeFactory.merge({
      hotel_id: hotel.id,
      organization_id: org.id,
      name: 'Deluxe Test Room',
      code: 'DLX-TEST',
    })
      .apply('deluxe')
      .create()

    // Associate amenities to room types
    const roomAmenity = await Amenity.findBy('code', 'wifi')
    if (roomAmenity) {
      await standardRoom.related('amenities').attach([roomAmenity.id])
      await deluxeRoom.related('amenities').attach([roomAmenity.id])
    }

    // Create rooms
    await RoomFactory.merge({
      organization_id: org.id,
      hotel_id: hotel.id,
      room_type_id: standardRoom.id,
      room_number: '101',
      floor: '1',
      housekeeping_status: 'clean',
    }).create()

    await RoomFactory.merge({
      organization_id: org.id,
      hotel_id: hotel.id,
      room_type_id: standardRoom.id,
      room_number: '102',
      floor: '1',
      housekeeping_status: 'clean',
    }).create()

    const deluxeRoomInstance = await RoomFactory.merge({
      organization_id: org.id,
      hotel_id: hotel.id,
      room_type_id: deluxeRoom.id,
      room_number: '201',
      floor: '2',
      housekeeping_status: 'clean',
    }).create()

    // Guests for tests
    await GuestFactory.merge({
      organization_id: org.id,
      email: 'guest@test.com',
      first_name: 'Test',
      last_name: 'Guest',
    }).create()

    const vipGuest = await GuestFactory.merge({
      organization_id: org.id,
      email: 'vip@test.com',
      first_name: 'VIP',
      last_name: 'Guest',
    })
      .apply('vip')
      .create()

    // Test reservation
    await ReservationFactory.merge({
      organization_id: org.id,
      hotel_id: hotel.id,
      room_id: deluxeRoomInstance.id,
      room_type_id: deluxeRoom.id,
      guest_id: vipGuest.id,
      created_by_user_id: staffUser.id,
      status: 'confirmed',
      confirmation_code: 'TEST-001',
    }).create()

    logger.info(`  ✓ Created test hotel with rooms and sample reservation`)
    logger.info('✓ Test data created successfully')
  }
}
