import { BaseSeeder } from '@adonisjs/lucid/seeders'
import app from '@adonisjs/core/services/app'
import db from '@adonisjs/lucid/services/db'
import logger from '@adonisjs/core/services/logger'

export default class extends BaseSeeder {
  private async runSeeder(Seeder: { default: typeof BaseSeeder }) {
    // Check environment before running
    if (Seeder.default.environment && !Seeder.default.environment.includes(app.nodeEnvironment)) {
      return
    }

    const seederName = Seeder.default.name || 'UnknownSeeder'
    logger.info(`Running ${seederName}...`)

    try {
      await new Seeder.default(this.client).run()
      logger.info(`✓ ${seederName} completed`)
    } catch (error) {
      logger.error(`✗ ${seederName} failed:`, error)
      throw error
    }
  }

  async run() {
    logger.info('Starting database seeding...')

    // Use transactions to ensure consistency
    await db.transaction(async (trx) => {
      this.client = trx

      // Execution order respecting dependencies
      await this.runSeeder(await import('#database/seeders/base/organization_seeder'))
      await this.runSeeder(await import('#database/seeders/base/admin_user_seeder'))
      await this.runSeeder(await import('#database/seeders/base/system_data_seeder'))

      // Conditional seeders by environment
      if (app.inDev) {
        await this.runSeeder(await import('#database/seeders/demo/hotel_seeder'))
        await this.runSeeder(await import('#database/seeders/demo/staff_seeder'))
        await this.runSeeder(await import('#database/seeders/demo/booking_seeder'))
      }

      if (app.inTest) {
        await this.runSeeder(await import('#database/seeders/test/test_data_seeder'))
      }
    })

    logger.info('✅ Database seeding completed successfully!')
  }
}
