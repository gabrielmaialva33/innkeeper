import factory from '@adonisjs/lucid/factories'
import { FactoryContextContract } from '@adonisjs/lucid/types/factory'
import { DateTime } from 'luxon'
import Staff from '#models/staff'
import { UserFactory } from './user_factory.js'

export const StaffFactory = factory
  .define(Staff, async ({ faker }: FactoryContextContract) => {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const employeeId = `EMP${faker.date.recent().getFullYear()}${faker.string.numeric({ length: 4 })}`

    // Generate realistic position based on department
    const departments = {
      front_desk: ['Front Desk Agent', 'Front Desk Supervisor', 'Night Auditor', 'Concierge'],
      housekeeping: [
        'Housekeeper',
        'Room Attendant',
        'Housekeeping Supervisor',
        'Laundry Attendant',
      ],
      food_service: ['Server', 'Bartender', 'Chef', 'Restaurant Manager', 'Room Service Attendant'],
      maintenance: ['Maintenance Technician', 'Engineer', 'Facilities Manager', 'Electrician'],
      management: ['General Manager', 'Assistant Manager', 'Operations Manager', 'Revenue Manager'],
      security: ['Security Officer', 'Security Supervisor', 'Night Security'],
      other: [
        'Sales Manager',
        'Event Coordinator',
        'Reservations Agent',
        'IT Support',
        'Spa Therapist',
      ],
    }

    const department = faker.helpers.objectKey(departments) as keyof typeof departments
    const position = faker.helpers.arrayElement(departments[department])

    const hireDate = faker.date.past({ years: 5 })
    const isActive = faker.datatype.boolean({ probability: 0.9 })
    const terminationDate = !isActive
      ? faker.date.between({ from: hireDate, to: new Date() })
      : null

    // Generate phone with extension for internal calls
    const phoneExtension = faker.string.numeric({ length: 4 })

    return {
      organization_id: 0, // Will be set by relation
      user_id: 0, // Will be set by relation
      employee_id: employeeId,
      position,
      department,
      hire_date: DateTime.fromJSDate(hireDate),
      termination_date: terminationDate ? DateTime.fromJSDate(terminationDate) : null,
      is_active: isActive,
      is_deleted: false,
      contact_info: {
        emergency_contact_name: faker.person.fullName(),
        emergency_contact_phone: faker.phone.number({ style: 'international' }),
        emergency_contact_relationship: faker.helpers.arrayElement([
          'Spouse',
          'Parent',
          'Sibling',
          'Friend',
          'Partner',
        ]),
      },
      metadata: {
        first_name: firstName,
        last_name: lastName,
        email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        phone: faker.phone.number({ style: 'international' }),
        mobile: faker.datatype.boolean({ probability: 0.8 })
          ? faker.phone.number({ style: 'international' })
          : null,
        permissions: {
          can_check_in: department === 'front_desk' || department === 'management',
          can_check_out: department === 'front_desk' || department === 'management',
          can_modify_rates:
            department === 'management' ||
            (department === 'front_desk' && position.includes('Supervisor')),
          can_void_transactions: department === 'management',
          can_access_reports: ['management', 'other'].includes(department),
          can_manage_inventory: ['housekeeping', 'food_service'].includes(department),
          can_approve_discounts: department === 'management' || position.includes('Manager'),
        },
        schedule: {
          shift_type: faker.helpers.arrayElement(['morning', 'afternoon', 'night', 'rotating']),
          days_off: faker.helpers.arrayElements(
            ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
            { min: 2, max: 2 }
          ),
          default_start_time: faker.helpers.arrayElement([
            '06:00',
            '07:00',
            '14:00',
            '15:00',
            '22:00',
            '23:00',
          ]),
          default_end_time: faker.helpers.arrayElement([
            '14:00',
            '15:00',
            '22:00',
            '23:00',
            '06:00',
            '07:00',
          ]),
        },
        employee_type: faker.helpers.arrayElement([
          'full_time',
          'part_time',
          'contract',
          'seasonal',
        ]),
        salary_type: faker.helpers.arrayElement(['hourly', 'salary', 'commission']),
        phone_extension: phoneExtension,
        certifications: faker.helpers.arrayElements(
          [
            'CPR',
            'First Aid',
            'Food Safety',
            'HVAC',
            'Electrical',
            'Plumbing',
            'Guest Service Excellence',
          ],
          { min: 0, max: 3 }
        ),
        languages: faker.helpers.arrayElements(
          ['English', 'Spanish', 'Portuguese', 'French', 'German', 'Mandarin', 'Japanese'],
          { min: 1, max: 3 }
        ),
        uniform_size: {
          shirt: faker.helpers.arrayElement(['XS', 'S', 'M', 'L', 'XL', 'XXL']),
          pants: faker.helpers.arrayElement(['28', '30', '32', '34', '36', '38', '40']),
        },
        parking_spot: faker.datatype.boolean({ probability: 0.3 })
          ? `P${faker.string.numeric({ length: 3 })}`
          : null,
        locker_number: faker.datatype.boolean({ probability: 0.7 })
          ? `L${faker.string.numeric({ length: 3 })}`
          : null,
        performance_rating: isActive
          ? faker.number.float({ min: 1, max: 5, fractionDigits: 1 })
          : null,
        last_review_date: isActive ? faker.date.recent({ days: 365 }) : null,
      },
    }
  })
  .relation('user', () => UserFactory)
  .state('manager', (staff, { faker }) => {
    staff.department = 'management'
    staff.position = faker.helpers.arrayElement([
      'General Manager',
      'Assistant Manager',
      'Department Manager',
    ])
    staff.metadata.permissions = {
      can_check_in: true,
      can_check_out: true,
      can_modify_rates: true,
      can_void_transactions: true,
      can_access_reports: true,
      can_manage_inventory: true,
      can_approve_discounts: true,
    }
    staff.metadata.employee_type = 'full_time'
    staff.metadata.salary_type = 'salary'
  })
  .state('frontDesk', (staff, { faker }) => {
    staff.department = 'front_desk'
    staff.position = faker.helpers.arrayElement([
      'Front Desk Agent',
      'Front Desk Supervisor',
      'Night Auditor',
    ])
    staff.metadata.permissions.can_check_in = true
    staff.metadata.permissions.can_check_out = true
    staff.metadata.schedule.shift_type = faker.helpers.arrayElement([
      'morning',
      'afternoon',
      'night',
    ])
  })
  .state('housekeeping', (staff, { faker }) => {
    staff.department = 'housekeeping'
    staff.position = faker.helpers.arrayElement([
      'Housekeeper',
      'Room Attendant',
      'Housekeeping Supervisor',
    ])
    staff.metadata.permissions.can_manage_inventory = true
    staff.metadata.assigned_floors = faker.helpers.arrayElements([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], {
      min: 2,
      max: 4,
    })
    staff.metadata.average_rooms_per_day = faker.number.int({ min: 10, max: 20 })
  })
  .state('nightShift', (staff, { faker }) => {
    staff.metadata.schedule.shift_type = 'night'
    staff.metadata.schedule.default_start_time = faker.helpers.arrayElement([
      '22:00',
      '23:00',
      '00:00',
    ])
    staff.metadata.schedule.default_end_time = faker.helpers.arrayElement([
      '06:00',
      '07:00',
      '08:00',
    ])
    staff.metadata.night_differential = 0.15 // 15% night shift bonus
  })
  .state('partTime', (staff) => {
    staff.metadata.employee_type = 'part_time'
    staff.metadata.salary_type = 'hourly'
    staff.metadata.max_hours_per_week = 30
    staff.metadata.benefits_eligible = false
  })
  .state('terminated', (staff, { faker }) => {
    staff.is_active = false
    staff.termination_date = DateTime.fromJSDate(faker.date.recent({ days: 180 }))
    staff.metadata.termination_reason = faker.helpers.arrayElement([
      'Resigned',
      'End of contract',
      'Performance',
      'Restructuring',
      'Personal reasons',
      'Found other employment',
    ])
    staff.metadata.rehire_eligible = faker.datatype.boolean({ probability: 0.7 })
  })
  .state('seasonal', (staff, { faker }) => {
    staff.metadata.employee_type = 'seasonal'
    staff.metadata.season_start = faker.helpers.arrayElement(['May', 'June', 'December'])
    staff.metadata.season_end = faker.helpers.arrayElement(['September', 'October', 'February'])
    staff.metadata.returning_employee = faker.datatype.boolean({ probability: 0.6 })
  })
  .before('create', async (_factory, staff) => {
    // Ensure termination date is after hire date
    if (staff.termination_date && staff.hire_date > staff.termination_date) {
      staff.termination_date = staff.hire_date.plus({ days: 30 })
    }

    // Set is_active based on termination date
    if (staff.termination_date && staff.termination_date < DateTime.now()) {
      staff.is_active = false
    }
  })
  .build()
