import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'organizations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable().primary()

      table.string('name').notNullable()
      table.string('slug').notNullable().unique()
      table.string('tax_id').nullable()
      table.string('email').notNullable()
      table.string('phone').nullable()

      table.string('address').nullable()
      table.string('city').nullable()
      table.string('state').nullable()
      table.string('country').nullable()
      table.string('postal_code').nullable()

      table.string('currency', 3).notNullable().defaultTo('USD')
      table.string('timezone').notNullable().defaultTo('UTC')

      table.boolean('is_active').defaultTo(true)
      table.boolean('is_deleted').defaultTo(false)

      table.jsonb('settings').defaultTo(
        JSON.stringify({
          overbooking_percentage: 10,
          default_check_in_time: '14:00',
          default_check_out_time: '11:00',
          cancellation_policy: 'flexible',
          payment_methods: ['cash', 'card'],
          supported_languages: ['en', 'pt'],
          night_audit_time: '02:00',
        })
      )

      table.jsonb('metadata').defaultTo('{}')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.index('slug')
      table.index('is_active')
      table.index('is_deleted')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
