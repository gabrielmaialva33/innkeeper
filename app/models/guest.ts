import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany, SnakeCaseNamingStrategy } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Organization from '#models/organization'
import User from '#models/user'
import Reservation from '#models/reservation'

export default class Guest extends BaseModel {
  static table = 'guests'
  static namingStrategy = new SnakeCaseNamingStrategy()

  /**
   * ------------------------------------------------------
   * Columns
   * ------------------------------------------------------
   */
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare organization_id: number

  @column()
  declare user_id: number | null

  @column()
  declare first_name: string

  @column()
  declare last_name: string

  @column()
  declare email: string

  @column()
  declare phone: string | null

  @column()
  declare mobile: string | null

  @column()
  declare document_type: 'passport' | 'id_card' | 'driver_license' | 'other' | null

  @column()
  declare document_number: string | null

  @column()
  declare document_issuer: string | null

  @column()
  declare document_expiry_date: DateTime | null

  @column()
  declare date_of_birth: DateTime | null

  @column()
  declare nationality: string | null

  @column()
  declare gender: 'male' | 'female' | 'other' | null

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
  declare company_name: string | null

  @column()
  declare tax_id: string | null

  @column()
  declare vip_status: 'none' | 'silver' | 'gold' | 'platinum'

  @column()
  declare loyalty_number: string | null

  @column()
  declare loyalty_points: number

  @column()
  declare is_blacklisted: boolean

  @column()
  declare blacklist_reason: string | null

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
  declare preferences: {
    room_preference: string | null
    floor_preference: string | null
    bed_preference: string | null
    smoking_preference: boolean | null
    dietary_restrictions: string[] | null
    special_requests: string | null
    language: string | null
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
  declare marketing: {
    accepts_marketing: boolean
    accepts_sms: boolean
    accepts_email: boolean
    source: string | null
    campaign: string | null
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

  @column.dateTime()
  declare last_stay_date: DateTime | null

  @column()
  declare total_stays: number

  @column()
  declare total_spent: number

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime | null

  /**
   * ------------------------------------------------------
   * Relationships
   * ------------------------------------------------------
   */
  @belongsTo(() => Organization, {
    foreignKey: 'organization_id',
  })
  declare organization: BelongsTo<typeof Organization>

  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  declare user: BelongsTo<typeof User>

  @hasMany(() => Reservation)
  declare reservations: HasMany<typeof Reservation>

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
