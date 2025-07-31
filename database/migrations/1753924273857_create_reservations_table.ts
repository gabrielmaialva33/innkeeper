import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'reservations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable().primary()

      table.integer('organization_id').unsigned().notNullable()
      table.foreign('organization_id').references('id').inTable('organizations').onDelete('CASCADE')

      table.integer('hotel_id').unsigned().notNullable()
      table.foreign('hotel_id').references('id').inTable('hotels').onDelete('CASCADE')

      table.integer('room_id').unsigned().nullable()
      table.foreign('room_id').references('id').inTable('rooms').onDelete('SET NULL')

      table.integer('room_type_id').unsigned().notNullable()
      table.foreign('room_type_id').references('id').inTable('room_types').onDelete('RESTRICT')

      table.integer('guest_id').unsigned().notNullable()
      table.foreign('guest_id').references('id').inTable('guests').onDelete('RESTRICT')

      table.integer('created_by_user_id').unsigned().notNullable()
      table.foreign('created_by_user_id').references('id').inTable('users').onDelete('RESTRICT')

      table.integer('group_reservation_id').unsigned().nullable()

      table.string('confirmation_number').notNullable().unique()

      table
        .enum('status', [
          'pending',
          'confirmed',
          'checked_in',
          'checked_out',
          'cancelled',
          'no_show',
        ])
        .notNullable()
        .defaultTo('pending')

      table
        .enum('channel', ['direct', 'website', 'phone', 'walkin', 'ota', 'corporate'])
        .notNullable()
        .defaultTo('direct')

      table.string('channel_reference').nullable()

      table.timestamp('check_in_date').notNullable()
      table.timestamp('check_out_date').notNullable()
      table.timestamp('actual_check_in').nullable()
      table.timestamp('actual_check_out').nullable()

      table.integer('adults').notNullable().defaultTo(1)
      table.integer('children').notNullable().defaultTo(0)
      table.integer('infants').notNullable().defaultTo(0)

      table.decimal('room_rate', 10, 2).notNullable()
      table.decimal('total_amount', 12, 2).notNullable()
      table.decimal('paid_amount', 12, 2).notNullable().defaultTo(0)
      table.decimal('discount_amount', 10, 2).notNullable().defaultTo(0)
      table.decimal('tax_amount', 10, 2).notNullable().defaultTo(0)

      table.string('currency', 3).notNullable()

      table
        .enum('payment_status', ['pending', 'partial', 'paid', 'refunded'])
        .notNullable()
        .defaultTo('pending')

      table
        .enum('payment_method', ['cash', 'card', 'bank_transfer', 'online', 'other'])
        .notNullable()
        .defaultTo('cash')

      table.text('special_requests').nullable()
      table.time('arrival_time').nullable()

      table.enum('purpose_of_visit', ['leisure', 'business', 'event', 'other']).nullable()

      table.boolean('is_vip').defaultTo(false)
      table.boolean('requires_pickup').defaultTo(false)
      table.string('pickup_location').nullable()
      table.timestamp('pickup_time').nullable()

      table.text('cancellation_reason').nullable()
      table.timestamp('cancelled_at').nullable()
      table.integer('cancelled_by_user_id').unsigned().nullable()
      table.foreign('cancelled_by_user_id').references('id').inTable('users').onDelete('SET NULL')

      table.boolean('is_deleted').defaultTo(false)

      table.jsonb('guest_details').defaultTo(
        JSON.stringify({
          additional_guests: [],
        })
      )

      table.jsonb('metadata').defaultTo('{}')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.index('organization_id')
      table.index('hotel_id')
      table.index('room_id')
      table.index('guest_id')
      table.index('confirmation_number')
      table.index('status')
      table.index('check_in_date')
      table.index('check_out_date')
      table.index(['hotel_id', 'check_in_date', 'check_out_date'])
      table.index('is_deleted')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
