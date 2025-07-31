import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'payments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable().primary()

      table.integer('organization_id').unsigned().notNullable()
      table.foreign('organization_id').references('id').inTable('organizations').onDelete('CASCADE')

      table.integer('reservation_id').unsigned().nullable()
      table.foreign('reservation_id').references('id').inTable('reservations').onDelete('CASCADE')

      table.integer('folio_id').unsigned().nullable()
      table.foreign('folio_id').references('id').inTable('folios').onDelete('CASCADE')

      table.integer('guest_id').unsigned().notNullable()
      table.foreign('guest_id').references('id').inTable('guests').onDelete('RESTRICT')

      table.integer('processed_by_user_id').unsigned().notNullable()
      table.foreign('processed_by_user_id').references('id').inTable('users').onDelete('RESTRICT')

      table.string('transaction_id').notNullable().unique()

      table
        .enum('type', ['payment', 'refund', 'deposit', 'advance'])
        .notNullable()
        .defaultTo('payment')

      table
        .enum('method', [
          'cash',
          'credit_card',
          'debit_card',
          'bank_transfer',
          'check',
          'online',
          'other',
        ])
        .notNullable()

      table
        .enum('status', ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'])
        .notNullable()
        .defaultTo('pending')

      table.decimal('amount', 12, 2).notNullable()
      table.string('currency', 3).notNullable()
      table.decimal('exchange_rate', 10, 6).notNullable().defaultTo(1)
      table.decimal('base_currency_amount', 12, 2).notNullable()

      table.string('gateway').nullable()
      table.string('gateway_transaction_id').nullable()
      table.text('gateway_response').nullable()

      table.string('card_last_four', 4).nullable()
      table.string('card_brand').nullable()

      table.string('reference_number').nullable()
      table.text('notes').nullable()
      table.string('receipt_number').nullable()

      table.timestamp('paid_at').nullable()
      table.timestamp('failed_at').nullable()
      table.text('failure_reason').nullable()

      table.boolean('is_deleted').defaultTo(false)

      table.jsonb('metadata').defaultTo('{}')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.index('organization_id')
      table.index('reservation_id')
      table.index('guest_id')
      table.index('transaction_id')
      table.index('status')
      table.index('type')
      table.index('paid_at')
      table.index('is_deleted')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
