import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Channel extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare code: string

  @column()
  declare type: 'ota' | 'gds' | 'direct' | 'corporate' | 'wholesaler'

  @column()
  declare description: string

  @column()
  declare website: string | null

  @column()
  declare support_email: string

  @column()
  declare support_phone: string

  @column()
  declare is_active: boolean

  @column()
  declare commission_percentage: number

  @column()
  declare payment_method: 'prepaid' | 'hotel_collect' | 'mixed'

  @column()
  declare payment_terms: 'prepaid' | 'hotel_collect' | 'mixed'

  @column()
  declare booking_fee: number

  @column()
  declare priority: number

  @column()
  declare supports_room_mapping: boolean

  @column()
  declare supports_rate_mapping: boolean

  @column()
  declare supports_availability_sync: boolean

  @column()
  declare supports_booking_delivery: boolean

  @column()
  declare supports_modification: boolean

  @column()
  declare supports_cancellation: boolean

  @column({
    serialize: (value: string | object) => {
      return typeof value === 'string' ? JSON.parse(value) : value
    },
  })
  declare api_config: {
    endpoint: string
    auth_type: 'basic' | 'oauth' | 'token' | 'key'
    credentials: {
      username: string
      password: string
      api_key: string
    }
    webhook_url: string | null
    rate_limit: number
    timeout: number
  }

  @column({
    serialize: (value: string | object) => {
      return typeof value === 'string' ? JSON.parse(value) : value
    },
  })
  declare mapping_config: {
    room_type_mapping: Record<string, string>
    rate_plan_mapping: Record<string, string>
    amenity_mapping: Record<string, string>
    payment_mapping: Record<string, string>
  }

  @column({
    serialize: (value: string | object) => {
      return typeof value === 'string' ? JSON.parse(value) : value
    },
  })
  declare restrictions: {
    booking_window: { min_days: number; max_days: number }
    stay_restrictions: { min_nights: number; max_nights: number }
    allowed_room_types: string[]
    allowed_rate_plans: string[]
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
