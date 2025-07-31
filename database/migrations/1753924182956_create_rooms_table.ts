import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'rooms'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable().primary()

      table.integer('organization_id').unsigned().notNullable()
      table.foreign('organization_id').references('id').inTable('organizations').onDelete('CASCADE')

      table.integer('hotel_id').unsigned().notNullable()
      table.foreign('hotel_id').references('id').inTable('hotels').onDelete('CASCADE')

      table.integer('room_type_id').unsigned().notNullable()
      table.foreign('room_type_id').references('id').inTable('room_types').onDelete('RESTRICT')

      table.string('room_number').notNullable()
      table.string('floor').nullable()
      table.string('building').nullable()

      table
        .enum('status', ['available', 'occupied', 'maintenance', 'blocked'])
        .notNullable()
        .defaultTo('available')
      table
        .enum('housekeeping_status', ['clean', 'dirty', 'inspected', 'out_of_service'])
        .notNullable()
        .defaultTo('clean')

      table.boolean('is_smoking').defaultTo(false)
      table.boolean('is_accessible').defaultTo(false)

      table.integer('connecting_room_id').unsigned().nullable()
      table.foreign('connecting_room_id').references('id').inTable('rooms').onDelete('SET NULL')

      table.timestamp('last_cleaned_at').nullable()
      table.timestamp('last_inspected_at').nullable()

      table.boolean('is_active').defaultTo(true)
      table.boolean('is_deleted').defaultTo(false)

      table.jsonb('notes').defaultTo(
        JSON.stringify({
          maintenance_notes: null,
          housekeeping_notes: null,
          special_features: null,
        })
      )

      table.jsonb('metadata').defaultTo('{}')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.unique(['hotel_id', 'room_number'])
      table.index('organization_id')
      table.index('hotel_id')
      table.index('room_type_id')
      table.index('status')
      table.index('housekeeping_status')
      table.index('is_active')
      table.index('is_deleted')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
