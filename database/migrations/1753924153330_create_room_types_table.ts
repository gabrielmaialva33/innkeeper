import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'room_types'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable().primary()

      table.integer('organization_id').unsigned().notNullable()
      table.foreign('organization_id').references('id').inTable('organizations').onDelete('CASCADE')

      table.integer('hotel_id').unsigned().notNullable()
      table.foreign('hotel_id').references('id').inTable('hotels').onDelete('CASCADE')

      table.string('name').notNullable()
      table.string('code').notNullable()
      table.text('description').nullable()

      table.integer('max_occupancy').notNullable()
      table.integer('max_adults').notNullable()
      table.integer('max_children').notNullable().defaultTo(0)

      table.decimal('base_price', 10, 2).notNullable()
      table.decimal('extra_bed_price', 10, 2).nullable()

      table.decimal('size_sqm', 8, 2).nullable()
      table.string('bed_type').nullable()
      table.integer('bed_count').notNullable().defaultTo(1)
      table.string('view_type').nullable()

      table.boolean('is_active').defaultTo(true)
      table.boolean('is_deleted').defaultTo(false)

      table.jsonb('images').defaultTo('[]')
      table.jsonb('metadata').defaultTo('{}')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.unique(['hotel_id', 'code'])
      table.index('organization_id')
      table.index('hotel_id')
      table.index('is_active')
      table.index('is_deleted')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
