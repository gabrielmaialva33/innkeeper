import { DateTime } from 'luxon'
import {
  BaseModel,
  belongsTo,
  column,
  hasMany,
  hasOne,
  manyToMany,
  SnakeCaseNamingStrategy,
} from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, HasOne, ManyToMany } from '@adonisjs/lucid/types/relations'
import Organization from '#models/organization'
import Hotel from '#models/hotel'
import Room from '#models/room'
import Guest from '#models/guest'
import User from '#models/user'
import Payment from '#models/payment'
import Folio from '#models/folio'
import Service from '#models/service'

export default class Reservation extends BaseModel {
  static table = 'reservations'
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
  declare room_id: number | null

  @column()
  declare room_type_id: number

  @column()
  declare guest_id: number

  @column()
  declare created_by_user_id: number

  @column()
  declare group_reservation_id: number | null

  @column()
  declare confirmation_number: string

  @column()
  declare status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show'

  @column()
  declare channel: 'direct' | 'website' | 'phone' | 'walkin' | 'ota' | 'corporate'

  @column()
  declare channel_reference: string | null

  @column.dateTime()
  declare check_in_date: DateTime

  @column.dateTime()
  declare check_out_date: DateTime

  @column.dateTime()
  declare actual_check_in: DateTime | null

  @column.dateTime()
  declare actual_check_out: DateTime | null

  @column()
  declare adults: number

  @column()
  declare children: number

  @column()
  declare infants: number

  @column()
  declare room_rate: number

  @column()
  declare total_amount: number

  @column()
  declare paid_amount: number

  @column()
  declare discount_amount: number

  @column()
  declare tax_amount: number

  @column()
  declare currency: string

  @column()
  declare payment_status: 'pending' | 'partial' | 'paid' | 'refunded'

  @column()
  declare payment_method: 'cash' | 'card' | 'bank_transfer' | 'online' | 'other'

  @column()
  declare special_requests: string | null

  @column()
  declare arrival_time: string | null

  @column()
  declare purpose_of_visit: 'leisure' | 'business' | 'event' | 'other' | null

  @column()
  declare is_vip: boolean

  @column()
  declare requires_pickup: boolean

  @column()
  declare pickup_location: string | null

  @column.dateTime()
  declare pickup_time: DateTime | null

  @column()
  declare cancellation_reason: string | null

  @column.dateTime()
  declare cancelled_at: DateTime | null

  @column()
  declare cancelled_by_user_id: number | null

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
  declare guest_details: {
    additional_guests: Array<{
      first_name: string
      last_name: string
      age: number | null
      document_number: string | null
    }>
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
  @belongsTo(() => Organization)
  declare organization: BelongsTo<typeof Organization>

  @belongsTo(() => Hotel)
  declare hotel: BelongsTo<typeof Hotel>

  @belongsTo(() => Room)
  declare room: BelongsTo<typeof Room>

  @belongsTo(() => Guest)
  declare guest: BelongsTo<typeof Guest>

  @belongsTo(() => User, {
    foreignKey: 'created_by_user_id',
  })
  declare createdBy: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'cancelled_by_user_id',
  })
  declare cancelledBy: BelongsTo<typeof User>

  @hasMany(() => Payment)
  declare payments: HasMany<typeof Payment>

  @hasOne(() => Folio)
  declare folio: HasOne<typeof Folio>

  @manyToMany(() => Service, {
    pivotTable: 'reservation_services',
    pivotColumns: ['quantity', 'unit_price', 'total_price'],
  })
  declare services: ManyToMany<typeof Service>

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
