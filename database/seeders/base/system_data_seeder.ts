import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Amenity from '#models/amenity'
import Service from '#models/service'
import Organization from '#models/organization'
import logger from '@adonisjs/core/services/logger'

export default class extends BaseSeeder {
  async run() {
    logger.info('Creating system data...')

    // System default amenities
    const amenities = [
      { code: 'wifi', name: 'Wi-Fi', category: 'room' as const, icon: 'wifi' },
      { code: 'parking', name: 'Parking', category: 'hotel' as const, icon: 'parking' },
      { code: 'pool', name: 'Swimming Pool', category: 'hotel' as const, icon: 'pool' },
      { code: 'gym', name: 'Fitness Center', category: 'hotel' as const, icon: 'gym' },
      { code: 'spa', name: 'Spa', category: 'hotel' as const, icon: 'spa' },
      { code: 'minibar', name: 'Mini Bar', category: 'room' as const, icon: 'minibar' },
      { code: 'safe', name: 'Safe', category: 'room' as const, icon: 'safe' },
      { code: 'ac', name: 'Air Conditioning', category: 'room' as const, icon: 'ac' },
      { code: 'tv', name: 'Smart TV', category: 'room' as const, icon: 'tv' },
      { code: 'coffee', name: 'Coffee Maker', category: 'room' as const, icon: 'coffee' },
      { code: 'hairdryer', name: 'Hair Dryer', category: 'bathroom' as const, icon: 'hairdryer' },
      { code: 'bathtub', name: 'Bathtub', category: 'bathroom' as const, icon: 'bathtub' },
      { code: 'kitchen', name: 'Kitchenette', category: 'kitchen' as const, icon: 'kitchen' },
      { code: 'microwave', name: 'Microwave', category: 'kitchen' as const, icon: 'microwave' },
      { code: 'restaurant', name: 'Restaurant', category: 'hotel' as const, icon: 'restaurant' },
      { code: 'bar', name: 'Bar', category: 'hotel' as const, icon: 'bar' },
      {
        code: 'business',
        name: 'Business Center',
        category: 'business' as const,
        icon: 'business',
      },
      { code: 'meeting', name: 'Meeting Rooms', category: 'business' as const, icon: 'meeting' },
      {
        code: 'wheelchair',
        name: 'Wheelchair Access',
        category: 'accessibility' as const,
        icon: 'wheelchair',
      },
      { code: 'elevator', name: 'Elevator', category: 'accessibility' as const, icon: 'elevator' },
      { code: 'beach', name: 'Beach Access', category: 'entertainment' as const, icon: 'beach' },
      { code: 'tennis', name: 'Tennis Court', category: 'entertainment' as const, icon: 'tennis' },
      { code: 'golf', name: 'Golf Course', category: 'entertainment' as const, icon: 'golf' },
      { code: 'kids', name: 'Kids Club', category: 'entertainment' as const, icon: 'kids' },
    ]

    let amenitiesCreated = 0
    for (const amenity of amenities) {
      await Amenity.updateOrCreate(
        { code: amenity.code },
        {
          ...amenity,
          description: `${amenity.name} amenity`,
          is_active: true,
          metadata: {},
        }
      )
      amenitiesCreated++
    }

    logger.info(`✓ Created/updated ${amenitiesCreated} amenities`)

    // Default services per organization
    const organizations = await Organization.all()
    const serviceTemplates = [
      {
        code: 'room-service',
        name: 'Room Service',
        category: 'food_beverage' as const,
        unit_price: 0,
        unit_type: 'per_item' as const,
        description: '24-hour room service',
      },
      {
        code: 'laundry',
        name: 'Laundry Service',
        category: 'laundry' as const,
        unit_price: 50,
        unit_type: 'per_item' as const,
        description: 'Same-day laundry service',
      },
      {
        code: 'dry-cleaning',
        name: 'Dry Cleaning',
        category: 'laundry' as const,
        unit_price: 75,
        unit_type: 'per_item' as const,
        description: 'Professional dry cleaning',
      },
      {
        code: 'spa-massage',
        name: 'Spa Massage',
        category: 'spa_wellness' as const,
        unit_price: 150,
        unit_type: 'per_hour' as const,
        description: 'Relaxing spa massage',
      },
      {
        code: 'airport-transfer',
        name: 'Airport Transfer',
        category: 'transportation' as const,
        unit_price: 60,
        unit_type: 'fixed' as const,
        description: 'One-way airport transportation',
      },
      {
        code: 'car-rental',
        name: 'Car Rental',
        category: 'transportation' as const,
        unit_price: 150,
        unit_type: 'per_day' as const,
        description: 'Daily car rental service',
      },
      {
        code: 'business-center',
        name: 'Business Center Access',
        category: 'business' as const,
        unit_price: 0,
        unit_type: 'per_hour' as const,
        description: 'Access to business center facilities',
      },
      {
        code: 'event-ticket',
        name: 'Event Tickets',
        category: 'entertainment' as const,
        unit_price: 25,
        unit_type: 'per_person' as const,
        description: 'Ticket booking service',
      },
      {
        code: 'birthday-package',
        name: 'Birthday Package',
        category: 'other' as const,
        unit_price: 150,
        unit_type: 'fixed' as const,
        description: 'Special birthday celebration package',
      },
    ]

    let servicesCreated = 0
    for (const org of organizations) {
      for (const template of serviceTemplates) {
        await Service.updateOrCreate(
          {
            organization_id: org.id,
            code: template.code,
          },
          {
            organization_id: org.id,
            hotel_id: null, // Organization-wide services
            ...template,
            tax_rate: 0.1,
            is_taxable: true,
            is_active: true,
            is_deleted: false,
            is_available_24_h: template.code === 'room-service',
            available_from: template.code === 'room-service' ? null : '08:00',
            available_until: template.code === 'room-service' ? null : '22:00',
            max_quantity_per_day: null,
            requires_advance_booking: ['spa-massage', 'car-rental', 'event-ticket'].includes(
              template.code
            ),
            advance_booking_hours: ['spa-massage', 'car-rental', 'event-ticket'].includes(
              template.code
            )
              ? 24
              : 0,
            metadata: {
              is_template: true,
              can_be_customized: true,
            },
          }
        )
        servicesCreated++
      }
    }

    logger.info(`✓ Created/updated ${servicesCreated} service templates`)
  }
}
