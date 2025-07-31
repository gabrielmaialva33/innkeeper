import { DateTime } from 'luxon'
import {
  BaseModel,
  belongsTo,
  column,
  manyToMany,
  SnakeCaseNamingStrategy,
} from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Organization from '#models/organization'
import Hotel from '#models/hotel'

export default class Staff extends BaseModel {
  static table = 'staff'
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
  declare user_id: number

  @column()
  declare employee_id: string

  @column()
  declare department:
    | 'front_desk'
    | 'housekeeping'
    | 'maintenance'
    | 'food_service'
    | 'management'
    | 'security'
    | 'other'

  @column()
  declare position: string

  @column()
  declare hire_date: DateTime

  @column()
  declare termination_date: DateTime | null

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
  declare contact_info: {
    emergency_contact_name: string | null
    emergency_contact_phone: string | null
    emergency_contact_relationship: string | null
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
  @belongsTo(() => Organization, {
    foreignKey: 'organization_id',
  })
  declare organization: BelongsTo<typeof Organization>

  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  declare user: BelongsTo<typeof User>

  @manyToMany(() => Hotel, {
    pivotTable: 'staff_hotels',
    pivotColumns: ['is_primary', 'started_at', 'ended_at'],
  })
  declare hotels: ManyToMany<typeof Hotel>

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
