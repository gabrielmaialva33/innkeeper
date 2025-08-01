import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class RatePlan extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare code: string

  @column()
  declare description: string

  @column()
  declare type: 'bar' | 'corporate' | 'package' | 'promotional' | 'government' | 'group'

  @column()
  declare is_active: boolean

  @column()
  declare is_public: boolean

  @column()
  declare priority: number

  @column()
  declare min_stay: number

  @column()
  declare max_stay: number | null

  @column()
  declare advance_booking_days: number

  @column()
  declare cancellation_policy: 'flexible' | 'moderate' | 'strict' | 'non_refundable'

  @column()
  declare includes_breakfast: boolean

  @column()
  declare commission_percentage: number

  @column()
  declare is_deleted: boolean

  @column({
    serialize: (value: string | object) => {
      return typeof value === 'string' ? JSON.parse(value) : value
    },
  })
  declare restrictions: {
    days_of_week: number[]
    booking_channels: string[]
    guest_types: string[]
    markets: string[]
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
