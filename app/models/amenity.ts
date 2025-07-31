import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, SnakeCaseNamingStrategy } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Hotel from '#models/hotel'
import RoomType from '#models/room_type'

export default class Amenity extends BaseModel {
  static table = 'amenities'
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
  declare code: string

  @column()
  declare description: string | null

  @column()
  declare category:
    | 'hotel'
    | 'room'
    | 'bathroom'
    | 'kitchen'
    | 'entertainment'
    | 'business'
    | 'accessibility'
    | 'other'

  @column()
  declare icon: string | null

  @column()
  declare is_active: boolean

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
  @manyToMany(() => Hotel, {
    pivotTable: 'hotel_amenities',
    pivotTimestamps: true,
  })
  declare hotels: ManyToMany<typeof Hotel>

  @manyToMany(() => RoomType, {
    pivotTable: 'room_type_amenities',
    pivotTimestamps: true,
  })
  declare room_types: ManyToMany<typeof RoomType>

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
