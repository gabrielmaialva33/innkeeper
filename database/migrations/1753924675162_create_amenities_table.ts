import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'amenities'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable().primary()

      table.string('name').notNullable()
      table.string('code').notNullable().unique()
      table.text('description').nullable()

      table
        .enum('category', [
          'hotel',
          'room',
          'bathroom',
          'kitchen',
          'entertainment',
          'business',
          'accessibility',
          'other',
        ])
        .notNullable()
        .defaultTo('other')

      table.string('icon').nullable()

      table.boolean('is_active').defaultTo(true)

      table.jsonb('metadata').defaultTo('{}')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.index('code')
      table.index('category')
      table.index('is_active')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
