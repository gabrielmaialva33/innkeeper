import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Organization from '#models/organization'
import logger from '@adonisjs/core/services/logger'

export default class extends BaseSeeder {
  async run() {
    logger.info('Seeding organizations...')

    // Use updateOrCreateMany for idempotency
    const organizations = await Organization.updateOrCreateMany('slug', [
      {
        slug: 'demo-hotels',
        name: 'Demo Hotel Group',
        email: 'contact@demo-hotels.com',
        settings: {
          overbooking_percentage: 10,
          default_check_in_time: '15:00',
          default_check_out_time: '11:00',
          cancellation_policy: 'flexible',
          payment_methods: ['credit_card', 'debit_card', 'cash'],
          supported_languages: ['en', 'pt'],
          night_audit_time: '02:00',
        },
        is_active: true,
      },
      {
        slug: 'boutique-collection',
        name: 'Boutique Hotels Collection',
        email: 'info@boutique-collection.com',
        settings: {
          overbooking_percentage: 0,
          default_check_in_time: '14:00',
          default_check_out_time: '12:00',
          cancellation_policy: 'moderate',
          payment_methods: ['credit_card', 'bank_transfer'],
          supported_languages: ['en', 'es', 'fr'],
          night_audit_time: '03:00',
        },
        is_active: true,
      },
    ])

    logger.info(`✓ Created/updated ${organizations.length} organizations`)
  }
}
