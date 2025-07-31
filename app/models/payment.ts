import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, SnakeCaseNamingStrategy } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Organization from '#models/organization'
import Reservation from '#models/reservation'
import Guest from '#models/guest'
import User from '#models/user'
import Folio from '#models/folio'

export default class Payment extends BaseModel {
  static table = 'payments'
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
  declare reservation_id: number | null

  @column()
  declare folio_id: number | null

  @column()
  declare guest_id: number

  @column()
  declare processed_by_user_id: number

  @column()
  declare transaction_id: string

  @column()
  declare type: 'payment' | 'refund' | 'deposit' | 'advance'

  @column()
  declare method:
    | 'cash'
    | 'credit_card'
    | 'debit_card'
    | 'bank_transfer'
    | 'check'
    | 'online'
    | 'other'

  @column()
  declare status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded'

  @column()
  declare amount: number

  @column()
  declare currency: string

  @column()
  declare exchange_rate: number

  @column()
  declare base_currency_amount: number

  @column()
  declare gateway: string | null

  @column()
  declare gateway_transaction_id: string | null

  @column()
  declare gateway_response: string | null

  @column()
  declare card_last_four: string | null

  @column()
  declare card_brand: string | null

  @column()
  declare reference_number: string | null

  @column()
  declare notes: string | null

  @column()
  declare receipt_number: string | null

  @column.dateTime()
  declare paid_at: DateTime | null

  @column.dateTime()
  declare failed_at: DateTime | null

  @column()
  declare failure_reason: string | null

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

  @belongsTo(() => Reservation, {
    foreignKey: 'reservation_id',
  })
  declare reservation: BelongsTo<typeof Reservation>

  @belongsTo(() => Folio, {
    foreignKey: 'folio_id',
  })
  declare folio: BelongsTo<typeof Folio>

  @belongsTo(() => Guest, {
    foreignKey: 'guest_id',
  })
  declare guest: BelongsTo<typeof Guest>

  @belongsTo(() => User, {
    foreignKey: 'processed_by_user_id',
  })
  declare processed_by: BelongsTo<typeof User>

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
