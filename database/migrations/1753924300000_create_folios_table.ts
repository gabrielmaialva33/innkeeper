import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'folios'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable().primary()

      table.integer('organization_id').unsigned().notNullable()
      table.foreign('organization_id').references('id').inTable('organizations').onDelete('CASCADE')

      table.integer('reservation_id').unsigned().notNullable()
      table.foreign('reservation_id').references('id').inTable('reservations').onDelete('CASCADE')

      table.integer('guest_id').unsigned().notNullable()
      table.foreign('guest_id').references('id').inTable('guests').onDelete('RESTRICT')

      table.string('folio_number').notNullable().unique()

      table
        .enum('status', ['open', 'closed', 'settled', 'disputed'])
        .notNullable()
        .defaultTo('open')

      table.decimal('room_charges', 12, 2).notNullable().defaultTo(0)
      table.decimal('service_charges', 12, 2).notNullable().defaultTo(0)
      table.decimal('tax_amount', 10, 2).notNullable().defaultTo(0)
      table.decimal('discount_amount', 10, 2).notNullable().defaultTo(0)
      table.decimal('total_amount', 12, 2).notNullable().defaultTo(0)
      table.decimal('paid_amount', 12, 2).notNullable().defaultTo(0)
      table.decimal('balance', 12, 2).notNullable().defaultTo(0)

      table.string('currency', 3).notNullable()

      table.timestamp('opened_at').notNullable()
      table.timestamp('closed_at').nullable()

      table.integer('closed_by_user_id').unsigned().nullable()
      table.foreign('closed_by_user_id').references('id').inTable('users').onDelete('SET NULL')

      table.text('notes').nullable()

      table.boolean('is_deleted').defaultTo(false)

      table.jsonb('metadata').defaultTo('{}')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.index('organization_id')
      table.index('reservation_id')
      table.index('guest_id')
      table.index('folio_number')
      table.index('status')
      table.index('is_deleted')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
