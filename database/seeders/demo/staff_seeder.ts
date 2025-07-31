import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Hotel from '#models/hotel'
import { StaffFactory } from '#database/factories/staff_factory'
import { UserFactory } from '#database/factories/user_factory'
import logger from '@adonisjs/core/services/logger'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  static environment = ['development']

  async run() {
    logger.info('Creating demo staff...')

    const hotels = await Hotel.query().preload('organization')

    for (const hotel of hotels) {
      logger.info(`  Creating staff for ${hotel.name}...`)

      // Staff structure by department
      const staffStructure = [
        {
          department: 'management' as const,
          positions: [
            { title: 'General Manager', count: 1 },
            { title: 'Assistant Manager', count: 1 },
          ],
        },
        {
          department: 'front_desk' as const,
          positions: [
            { title: 'Front Desk Supervisor', count: 2 },
            { title: 'Front Desk Agent', count: 6 },
            { title: 'Night Auditor', count: 2 },
          ],
        },
        {
          department: 'housekeeping' as const,
          positions: [
            { title: 'Housekeeping Supervisor', count: 2 },
            { title: 'Room Attendant', count: 10 },
            { title: 'Laundry Attendant', count: 2 },
          ],
        },
        {
          department: 'food_service' as const,
          positions: [
            { title: 'Restaurant Manager', count: 1 },
            { title: 'Chef', count: 2 },
            { title: 'Server', count: 6 },
            { title: 'Bartender', count: 2 },
          ],
        },
        {
          department: 'maintenance' as const,
          positions: [
            { title: 'Facilities Manager', count: 1 },
            { title: 'Maintenance Technician', count: 2 },
          ],
        },
        {
          department: 'security' as const,
          positions: [
            { title: 'Security Supervisor', count: 1 },
            { title: 'Security Officer', count: 3 },
          ],
        },
      ]

      let totalStaff = 0
      let staffCounter = 1

      for (const dept of staffStructure) {
        for (const pos of dept.positions) {
          for (let i = 0; i < pos.count; i++) {
            // Create user first
            const user = await UserFactory.merge({
              organization_id: hotel.organization_id,
              password: 'staff123', // Hash automatic by model
            }).create()

            // Generate unique employee_id per hotel/organization
            const employeeId = `EMP${hotel.id.toString().padStart(3, '0')}${staffCounter.toString().padStart(4, '0')}`
            staffCounter++

            // Create staff member with user_id
            const staff = await StaffFactory.merge({
              organization_id: hotel.organization_id,
              user_id: user.id,
              employee_id: employeeId,
              department: dept.department,
              position: pos.title,
              // Vary hire date
              hire_date: DateTime.now().minus({
                days: Math.floor(Math.random() * 1825), // Up to 5 years
              }),
            }).create()

            // Associate to hotel with pivot information
            await staff.related('hotels').attach({
              [hotel.id]: {
                is_primary: true,
                started_at: staff.hire_date.toSQL(),
              },
            })

            totalStaff++
          }
        }
      }

      // Create some staff members in multiple hotels (for chains)
      // Skip this logic to avoid duplicate key constraint issues
      // TODO: Implement better logic for shared staff across hotels

      logger.info(`    ✓ Created ${totalStaff} staff members for ${hotel.name}`)
    }

    logger.info('✓ Demo staff created successfully')
  }
}
