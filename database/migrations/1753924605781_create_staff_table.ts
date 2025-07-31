import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'staff'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable().primary()

      table.integer('organization_id').unsigned().notNullable()
      table.foreign('organization_id').references('id').inTable('organizations').onDelete('CASCADE')

      table.integer('user_id').unsigned().notNullable()
      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')

      table.string('employee_id').notNullable()

      table
        .enum('department', [
          'front_desk',
          'housekeeping',
          'maintenance',
          'food_service',
          'management',
          'security',
          'other',
        ])
        .notNullable()

      table.string('position').notNullable()

      table.date('hire_date').notNullable()
      table.date('termination_date').nullable()

      table.boolean('is_active').defaultTo(true)
      table.boolean('is_deleted').defaultTo(false)

      table.jsonb('contact_info').defaultTo(
        JSON.stringify({
          emergency_contact_name: null,
          emergency_contact_phone: null,
          emergency_contact_relationship: null,
        })
      )

      table.jsonb('metadata').defaultTo('{}')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.unique(['organization_id', 'employee_id'])
      table.unique(['organization_id', 'user_id'])
      table.index('organization_id')
      table.index('user_id')
      table.index('department')
      table.index('is_active')
      table.index('is_deleted')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
