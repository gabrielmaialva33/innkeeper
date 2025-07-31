import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'hotels'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable().primary()

      table.integer('organization_id').unsigned().notNullable()
      table.foreign('organization_id').references('id').inTable('organizations').onDelete('CASCADE')

      table.string('name').notNullable()
      table.string('slug').notNullable()
      table.text('description').nullable()

      table.string('email').notNullable()
      table.string('phone').notNullable()
      table.string('website').nullable()

      table.string('address').notNullable()
      table.string('city').notNullable()
      table.string('state').nullable()
      table.string('country').notNullable()
      table.string('postal_code').notNullable()

      table.decimal('latitude', 10, 8).nullable()
      table.decimal('longitude', 11, 8).nullable()

      table.string('timezone').notNullable()
      table.string('currency', 3).notNullable()

      table.integer('star_rating').nullable().checkBetween([1, 5])
      table.integer('total_rooms').notNullable().defaultTo(0)

      table.time('check_in_time').notNullable().defaultTo('14:00')
      table.time('check_out_time').notNullable().defaultTo('11:00')

      table.boolean('is_active').defaultTo(true)
      table.boolean('is_deleted').defaultTo(false)

      table.jsonb('policies').defaultTo(
        JSON.stringify({
          cancellation_policy: 'flexible',
          pet_policy: 'not_allowed',
          smoking_policy: 'non_smoking',
          child_policy: 'allowed',
          payment_policy: 'full_payment',
          overbooking_percentage: 10,
        })
      )

      table.jsonb('contact_info').defaultTo(
        JSON.stringify({
          front_desk_phone: null,
          reservation_phone: null,
          emergency_phone: null,
          manager_name: null,
          manager_email: null,
        })
      )

      table.jsonb('metadata').defaultTo('{}')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.unique(['organization_id', 'slug'])
      table.index('organization_id')
      table.index('is_active')
      table.index('is_deleted')
      table.index(['city', 'country'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
