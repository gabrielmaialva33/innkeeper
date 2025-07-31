import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany, SnakeCaseNamingStrategy } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Organization from '#models/organization'
import Reservation from '#models/reservation'
import Guest from '#models/guest'
import User from '#models/user'
import Payment from '#models/payment'

export default class Folio extends BaseModel {
  static table = 'folios'
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
  declare reservation_id: number

  @column()
  declare guest_id: number

  @column()
  declare folio_number: string

  @column()
  declare status: 'open' | 'closed' | 'settled' | 'disputed'

  @column()
  declare room_charges: number

  @column()
  declare service_charges: number

  @column()
  declare tax_amount: number

  @column()
  declare discount_amount: number

  @column()
  declare total_amount: number

  @column()
  declare paid_amount: number

  @column()
  declare balance: number

  @column()
  declare currency: string

  @column.dateTime()
  declare opened_at: DateTime

  @column.dateTime()
  declare closed_at: DateTime | null

  @column()
  declare closed_by_user_id: number | null

  @column()
  declare notes: string | null

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
  @belongsTo(() => Organization)
  declare organization: BelongsTo<typeof Organization>

  @belongsTo(() => Reservation)
  declare reservation: BelongsTo<typeof Reservation>

  @belongsTo(() => Guest)
  declare guest: BelongsTo<typeof Guest>

  @belongsTo(() => User, {
    foreignKey: 'closed_by_user_id',
  })
  declare closedBy: BelongsTo<typeof User>

  @hasMany(() => Payment)
  declare payments: HasMany<typeof Payment>

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
