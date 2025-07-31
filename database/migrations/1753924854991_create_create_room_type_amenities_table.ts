import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'room_type_amenities'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('room_type_id').unsigned().notNullable()
      table.foreign('room_type_id').references('id').inTable('room_types').onDelete('CASCADE')

      table.integer('amenity_id').unsigned().notNullable()
      table.foreign('amenity_id').references('id').inTable('amenities').onDelete('CASCADE')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.primary(['room_type_id', 'amenity_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
