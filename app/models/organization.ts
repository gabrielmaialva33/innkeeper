import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, SnakeCaseNamingStrategy } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Hotel from '#models/hotel'
import User from '#models/user'

export default class Organization extends BaseModel {
  static table = 'organizations'
  static namingStrategy = new SnakeCaseNamingStrategy()

  /**
   * ------------------------------------------------------
   * Columns
   * ------------------------------------------------------
   */
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare tax_id: string | null

  @column()
  declare email: string

  @column()
  declare phone: string | null

  @column()
  declare address: string | null

  @column()
  declare city: string | null

  @column()
  declare state: string | null

  @column()
  declare country: string | null

  @column()
  declare postal_code: string | null

  @column()
  declare currency: string

  @column()
  declare timezone: string

  @column()
  declare is_active: boolean

  @column()
  declare is_deleted: boolean

  @column({
    prepare: (value) => JSON.stringify(value),
    consume: (value) => {
      if (typeof value === 'string') {
        return JSON.parse(value)
      }
      return value
    },
  })
  declare settings: {
    overbooking_percentage: number
    default_check_in_time: string
    default_check_out_time: string
    cancellation_policy: string
    payment_methods: string[]
    supported_languages: string[]
    night_audit_time: string
  }

  @column({
    prepare: (value) => JSON.stringify(value),
    consume: (value) => {
      if (typeof value === 'string') {
        return JSON.parse(value)
      }
      return value
    },
  })
  declare metadata: Record<string, any>

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime | null

  /**
   * ------------------------------------------------------
   * Relationships
   * ------------------------------------------------------
   */
  @hasMany(() => Hotel, {
    foreignKey: 'organization_id',
  })
  declare hotels: HasMany<typeof Hotel>

  @hasMany(() => User, {
    foreignKey: 'organization_id',
  })
  declare users: HasMany<typeof User>

  /**
   * ------------------------------------------------------
   * Hooks
   * ------------------------------------------------------
   */

  /**
   * ------------------------------------------------------
   * Query Scopes
   * ------------------------------------------------------
   */
}
