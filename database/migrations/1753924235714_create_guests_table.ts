import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'guests'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable().primary()

      table.integer('organization_id').unsigned().notNullable()
      table.foreign('organization_id').references('id').inTable('organizations').onDelete('CASCADE')

      table.integer('user_id').unsigned().nullable()
      table.foreign('user_id').references('id').inTable('users').onDelete('SET NULL')

      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.string('email').notNullable()
      table.string('phone').nullable()
      table.string('mobile').nullable()

      table.enum('document_type', ['passport', 'id_card', 'driver_license', 'other']).nullable()
      table.string('document_number').nullable()
      table.string('document_issuer').nullable()
      table.date('document_expiry_date').nullable()

      table.date('date_of_birth').nullable()
      table.string('nationality').nullable()
      table.enum('gender', ['male', 'female', 'other']).nullable()

      table.string('address').nullable()
      table.string('city').nullable()
      table.string('state').nullable()
      table.string('country').nullable()
      table.string('postal_code').nullable()

      table.string('company_name').nullable()
      table.string('tax_id').nullable()

      table
        .enum('vip_status', ['none', 'silver', 'gold', 'platinum'])
        .notNullable()
        .defaultTo('none')
      table.string('loyalty_number').nullable()
      table.integer('loyalty_points').notNullable().defaultTo(0)

      table.boolean('is_blacklisted').defaultTo(false)
      table.text('blacklist_reason').nullable()

      table.boolean('is_deleted').defaultTo(false)

      table.jsonb('preferences').defaultTo(
        JSON.stringify({
          room_preference: null,
          floor_preference: null,
          bed_preference: null,
          smoking_preference: null,
          dietary_restrictions: null,
          special_requests: null,
          language: null,
        })
      )

      table.jsonb('marketing').defaultTo(
        JSON.stringify({
          accepts_marketing: false,
          accepts_sms: false,
          accepts_email: false,
          source: null,
          campaign: null,
        })
      )

      table.jsonb('metadata').defaultTo('{}')

      table.timestamp('last_stay_date').nullable()
      table.integer('total_stays').notNullable().defaultTo(0)
      table.decimal('total_spent', 12, 2).notNullable().defaultTo(0)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.unique(['organization_id', 'email'])
      table.index('organization_id')
      table.index('user_id')
      table.index('email')
      table.index('document_number')
      table.index('vip_status')
      table.index('is_blacklisted')
      table.index('is_deleted')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
