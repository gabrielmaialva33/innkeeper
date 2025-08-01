import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class RatePrice extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime()
  declare date: DateTime

  @column()
  declare currency: string

  @column()
  declare amount_single: number

  @column()
  declare amount_double: number

  @column()
  declare amount_triple: number | null

  @column()
  declare amount_quad: number | null

  @column()
  declare extra_adult_charge: number

  @column()
  declare extra_child_charge: number

  @column()
  declare breakfast_included_value: number

  @column()
  declare is_override: boolean

  @column()
  declare override_reason: string | null

  @column()
  declare override_by_user_id: number | null

  @column()
  declare is_approved: boolean

  @column()
  declare approved_by_user_id: number | null

  @column.dateTime()
  declare approved_at: DateTime | null

  @column({
    serialize: (value: string | object) => {
      return typeof value === 'string' ? JSON.parse(value) : value
    },
  })
  declare yield_adjustments: {
    occupancy_threshold: number
    adjustment_percentage: number
    last_minute_discount: number
    early_bird_discount: number
  }

  @column({
    serialize: (value: string | object) => {
      return typeof value === 'string' ? JSON.parse(value) : value
    },
  })
  declare metadata: Record<string, any>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
