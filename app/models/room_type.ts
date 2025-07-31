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
import Hotel from '#models/hotel'
import Room from '#models/room'
import Amenity from '#models/amenity'

export default class RoomType extends BaseModel {
  static table = 'room_types'
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
  declare name: string

  @column()
  declare code: string

  @column()
  declare description: string | null

  @column()
  declare max_occupancy: number

  @column()
  declare max_adults: number

  @column()
  declare max_children: number

  @column()
  declare base_price: number

  @column()
  declare extra_bed_price: number | null

  @column()
  declare size_sqm: number | null

  @column()
  declare bed_type: string | null

  @column()
  declare bed_count: number

  @column()
  declare view_type: string | null

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
  declare images: string[]

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

  @hasMany(() => Room)
  declare rooms: HasMany<typeof Room>

  @manyToMany(() => Amenity, {
    pivotTable: 'room_type_amenities',
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
