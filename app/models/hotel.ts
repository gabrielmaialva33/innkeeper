import { DateTime } from 'luxon'
import {
  BaseModel,
  belongsTo,
  column,
  hasMany,
  manyToMany,
  SnakeCaseNamingStrategy,
} from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Organization from '#models/organization'
import Room from '#models/room'
import RoomType from '#models/room_type'
import Staff from '#models/staff'
import Amenity from '#models/amenity'

export default class Hotel extends BaseModel {
  static table = 'hotels'
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
  declare name: string

  @column()
  declare slug: string

  @column()
  declare description: string | null

  @column()
  declare email: string

  @column()
  declare phone: string

  @column()
  declare website: string | null

  @column()
  declare address: string

  @column()
  declare city: string

  @column()
  declare state: string | null

  @column()
  declare country: string

  @column()
  declare postal_code: string

  @column()
  declare latitude: number | null

  @column()
  declare longitude: number | null

  @column()
  declare timezone: string

  @column()
  declare currency: string

  @column()
  declare star_rating: number | null

  @column()
  declare total_rooms: number

  @column()
  declare check_in_time: string

  @column()
  declare check_out_time: string

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
  declare policies: {
    cancellation_policy: string
    pet_policy: string
    smoking_policy: string
    child_policy: string
    payment_policy: string
    overbooking_percentage: number
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
  declare contact_info: {
    front_desk_phone: string | null
    reservation_phone: string | null
    emergency_phone: string | null
    manager_name: string | null
    manager_email: string | null
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

  @hasMany(() => Room)
  declare rooms: HasMany<typeof Room>

  @hasMany(() => RoomType)
  declare roomTypes: HasMany<typeof RoomType>

  @manyToMany(() => Staff, {
    pivotTable: 'staff_hotels',
  })
  declare staff: ManyToMany<typeof Staff>

  @manyToMany(() => Amenity, {
    pivotTable: 'hotel_amenities',
  })
  declare amenities: ManyToMany<typeof Amenity>

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
