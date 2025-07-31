import { DateTime } from 'luxon'
import {
  BaseModel,
  belongsTo,
  column,
  manyToMany,
  SnakeCaseNamingStrategy,
} from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Organization from '#models/organization'
import Hotel from '#models/hotel'
import Reservation from '#models/reservation'

export default class Service extends BaseModel {
  static table = 'services'
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
  declare hotel_id: number | null

  @column()
  declare name: string

  @column()
  declare code: string

  @column()
  declare description: string | null

  @column()
  declare category:
    | 'food_beverage'
    | 'spa_wellness'
    | 'transportation'
    | 'laundry'
    | 'business'
    | 'entertainment'
    | 'other'

  @column()
  declare unit_price: number

  @column()
  declare unit_type: 'per_person' | 'per_room' | 'per_hour' | 'per_day' | 'per_item' | 'fixed'

  @column()
  declare tax_rate: number

  @column()
  declare is_taxable: boolean

  @column()
  declare is_available_24_h: boolean

  @column()
  declare available_from: string | null

  @column()
  declare available_until: string | null

  @column()
  declare max_quantity_per_day: number | null

  @column()
  declare requires_advance_booking: boolean

  @column()
  declare advance_booking_hours: number

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

  @belongsTo(() => Hotel, {
    foreignKey: 'hotel_id',
  })
  declare hotel: BelongsTo<typeof Hotel>

  @manyToMany(() => Reservation, {
    pivotTable: 'reservation_services',
    pivotColumns: ['quantity', 'unit_price', 'total_price'],
  })
  declare reservations: ManyToMany<typeof Reservation>

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
