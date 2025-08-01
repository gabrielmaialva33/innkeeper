import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class GroupReservation extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare group_code: string

  @column()
  declare group_name: string

  @column()
  declare company_name: string | null

  @column()
  declare contact_name: string

  @column()
  declare contact_email: string

  @column()
  declare contact_phone: string

  @column()
  declare total_rooms: number

  @column()
  declare blocked_rooms: number

  @column()
  declare picked_up_rooms: number

  @column()
  declare room_rate: number

  @column()
  declare currency: string

  @column()
  declare commission_percentage: number

  @column.dateTime()
  declare cutoff_date: DateTime

  @column.dateTime()
  declare release_date: DateTime

  @column()
  declare status: 'tentative' | 'confirmed' | 'cancelled' | 'completed'

  @column()
  declare payment_method: 'master_bill' | 'individual_bill' | 'mixed'

  @column()
  declare billing_instructions: string | null

  @column()
  declare special_requests: string | null

  @column()
  declare created_by_user_id: number

  @column()
  declare approved_by_user_id: number | null

  @column.dateTime()
  declare approved_at: DateTime | null

  @column()
  declare is_deleted: boolean

  @column({
    serialize: (value: string | object) => {
      return typeof value === 'string' ? JSON.parse(value) : value
    },
  })
  declare room_block: {
    room_types: {
      room_type_id: number
      quantity: number
      rate: number
    }[]
    dates: {
      date: string | null
      rooms: number
    }[]
  }

  @column({
    serialize: (value: string | object) => {
      return typeof value === 'string' ? JSON.parse(value) : value
    },
  })
  declare event_details: {
    event_name: string
    event_type: string
    event_date: string
    attendees: number
    meeting_rooms: string[]
    catering_required: boolean
    av_equipment: string[]
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
