import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'reservation_services'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('reservation_id').unsigned().notNullable()
      table.foreign('reservation_id').references('id').inTable('reservations').onDelete('CASCADE')

      table.integer('service_id').unsigned().notNullable()
      table.foreign('service_id').references('id').inTable('services').onDelete('CASCADE')

      table.integer('quantity').notNullable().defaultTo(1)
      table.decimal('unit_price', 10, 2).notNullable()
      table.decimal('total_price', 12, 2).notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.primary(['reservation_id', 'service_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
