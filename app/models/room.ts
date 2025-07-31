import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany, SnakeCaseNamingStrategy } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Hotel from '#models/hotel'
import RoomType from '#models/room_type'
import Reservation from '#models/reservation'

export default class Room extends BaseModel {
  static table = 'rooms'
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
  declare hotel_id: number

  @column()
  declare room_type_id: number

  @column()
  declare room_number: string

  @column()
  declare floor: string | null

  @column()
  declare building: string | null

  @column()
  declare status: 'available' | 'occupied' | 'maintenance' | 'blocked'

  @column()
  declare housekeeping_status: 'clean' | 'dirty' | 'inspected' | 'out_of_service'

  @column()
  declare is_smoking: boolean

  @column()
  declare is_accessible: boolean

  @column()
  declare connecting_room_id: number | null

  @column()
  declare last_cleaned_at: DateTime | null

  @column()
  declare last_inspected_at: DateTime | null

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
  declare notes: {
    maintenance_notes: string | null
    housekeeping_notes: string | null
    special_features: string[] | null
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
  @belongsTo(() => Hotel, {
    foreignKey: 'hotel_id',
  })
  declare hotel: BelongsTo<typeof Hotel>

  @belongsTo(() => RoomType, {
    foreignKey: 'room_type_id',
  })
  declare roomType: BelongsTo<typeof RoomType>

  @belongsTo(() => Room, {
    foreignKey: 'connecting_room_id',
  })
  declare connectingRoom: BelongsTo<typeof Room>

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
