import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Organization from '#models/organization'
import logger from '@adonisjs/core/services/logger'

export default class extends BaseSeeder {
  async run() {
    logger.info('Creating admin users...')

    const organizations = await Organization.all()
    let usersCreated = 0

    for (const org of organizations) {
      // The User model's beforeSave hook will automatically hash the password
      const user = await User.updateOrCreate(
        { email: `admin@${org.slug}.com` },
        {
          organization_id: org.id,
          full_name: 'System Administrator',
          username: `admin_${org.slug}`,
          password: 'admin123', // Hash will be done automatically by the model
          is_deleted: false,
        }
      )

      logger.info(`  - Admin user created for ${org.name}: ${user.email}`)
      usersCreated++
    }

    logger.info(`✓ Created/updated ${usersCreated} admin users`)
  }
}
