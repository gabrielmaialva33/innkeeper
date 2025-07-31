import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'staff_hotels'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('staff_id').unsigned().notNullable()
      table.foreign('staff_id').references('id').inTable('staff').onDelete('CASCADE')

      table.integer('hotel_id').unsigned().notNullable()
      table.foreign('hotel_id').references('id').inTable('hotels').onDelete('CASCADE')

      table.boolean('is_primary').defaultTo(false)
      table.timestamp('started_at').notNullable()
      table.timestamp('ended_at').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.primary(['staff_id', 'hotel_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
