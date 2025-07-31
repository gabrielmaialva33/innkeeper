import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'hotel_amenities'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('hotel_id').unsigned().notNullable()
      table.foreign('hotel_id').references('id').inTable('hotels').onDelete('CASCADE')

      table.integer('amenity_id').unsigned().notNullable()
      table.foreign('amenity_id').references('id').inTable('amenities').onDelete('CASCADE')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.primary(['hotel_id', 'amenity_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
