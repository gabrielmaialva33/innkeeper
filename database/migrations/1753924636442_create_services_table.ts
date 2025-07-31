import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'services'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable().primary()

      table.integer('organization_id').unsigned().notNullable()
      table.foreign('organization_id').references('id').inTable('organizations').onDelete('CASCADE')

      table.integer('hotel_id').unsigned().nullable()
      table.foreign('hotel_id').references('id').inTable('hotels').onDelete('CASCADE')

      table.string('name').notNullable()
      table.string('code').notNullable()
      table.text('description').nullable()

      table
        .enum('category', [
          'food_beverage',
          'spa_wellness',
          'transportation',
          'laundry',
          'business',
          'entertainment',
          'other',
        ])
        .notNullable()

      table.decimal('unit_price', 10, 2).notNullable()
      table
        .enum('unit_type', ['per_person', 'per_room', 'per_hour', 'per_day', 'per_item', 'fixed'])
        .notNullable()
        .defaultTo('fixed')

      table.decimal('tax_rate', 5, 2).notNullable().defaultTo(0)
      table.boolean('is_taxable').defaultTo(true)

      table.boolean('is_available_24h').defaultTo(false)
      table.time('available_from').nullable()
      table.time('available_until').nullable()

      table.integer('max_quantity_per_day').nullable()

      table.boolean('requires_advance_booking').defaultTo(false)
      table.integer('advance_booking_hours').notNullable().defaultTo(0)

      table.boolean('is_active').defaultTo(true)
      table.boolean('is_deleted').defaultTo(false)

      table.jsonb('metadata').defaultTo('{}')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.unique(['organization_id', 'code'])
      table.index('organization_id')
      table.index('hotel_id')
      table.index('category')
      table.index('is_active')
      table.index('is_deleted')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
