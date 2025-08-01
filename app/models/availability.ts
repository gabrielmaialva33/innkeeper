import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Availability extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime()
  declare date: DateTime

  @column()
  declare total_inventory: number

  @column()
  declare available_rooms: number

  @column()
  declare blocked_rooms: number

  @column()
  declare sold_rooms: number

  @column()
  declare out_of_order_rooms: number

  @column()
  declare complimentary_rooms: number

  @column()
  declare house_use_rooms: number

  @column()
  declare minimum_stay: number

  @column()
  declare maximum_stay: number | null

  @column()
  declare stop_sell: boolean

  @column()
  declare closed_to_arrival: boolean

  @column()
  declare closed_to_departure: boolean

  @column()
  declare overbooking_limit: number

  @column({
    serialize: (value: string | object) => {
      return typeof value === 'string' ? JSON.parse(value) : value
    },
  })
  declare channel_restrictions: Record<string, { stop_sell: boolean; available_rooms: number }>

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
