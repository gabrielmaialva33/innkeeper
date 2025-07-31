import factory from '@adonisjs/lucid/factories'
import { FactoryContextContract } from '@adonisjs/lucid/types/factory'
import { DateTime } from 'luxon'
import Room from '#models/room'
import { RoomTypeFactory } from './room_type_factory.js'

export const RoomFactory = factory
  .define(Room, async ({ faker }: FactoryContextContract) => {
    // Generate room number based on floor logic
    const floor = faker.number.int({ min: 1, max: 10 })
    const roomOnFloor = faker.number.int({ min: 1, max: 20 })
    const roomNumber = (floor * 100 + roomOnFloor).toString()

    return {
      organization_id: 0, // Will be set by relation
      room_type_id: 0, // Will be set by relation
      room_number: roomNumber,
      floor: floor.toString(),
      status: faker.helpers.weightedArrayElement([
        { value: 'available', weight: 70 },
        { value: 'occupied', weight: 20 },
        { value: 'maintenance', weight: 5 },
        { value: 'blocked', weight: 5 },
      ]),
      is_active: true,
      housekeeping_status: faker.helpers.weightedArrayElement([
        { value: 'clean', weight: 60 },
        { value: 'dirty', weight: 25 },
        { value: 'inspected', weight: 10 },
        { value: 'out_of_service', weight: 5 },
      ]) as 'clean' | 'dirty' | 'inspected' | 'out_of_service',
      is_smoking: faker.datatype.boolean({ probability: 0.1 }),
      is_accessible: faker.datatype.boolean({ probability: 0.15 }),
      connecting_room_id: null,
      last_cleaned_at: DateTime.fromJSDate(faker.date.recent({ days: 2 })),
      last_inspected_at: DateTime.fromJSDate(faker.date.recent({ days: 7 })),
      notes: {
        maintenance_notes: faker.datatype.boolean({ probability: 0.1 })
          ? faker.lorem.sentence()
          : null,
        housekeeping_notes: faker.datatype.boolean({ probability: 0.1 })
          ? faker.lorem.sentence()
          : null,
        special_features: faker.datatype.boolean({ probability: 0.2 })
          ? faker.helpers.arrayElements(['corner_room', 'high_floor', 'quiet_location'], {
              min: 1,
              max: 2,
            })
          : null,
      },
      metadata: {
        position: faker.helpers.arrayElement(['front', 'back', 'corner', 'center']),
        connected_room: faker.datatype.boolean({ probability: 0.1 })
          ? (floor * 100 + roomOnFloor + 1).toString()
          : null,
        features: faker.helpers.arrayElements(
          [
            'renovated_recently',
            'quiet_location',
            'near_elevator',
            'near_stairs',
            'high_floor',
            'corner_room',
          ],
          { min: 0, max: 3 }
        ),
        last_inspection: faker.date.recent({ days: 30 }),
        maintenance_history: [],
      },
    }
  })
  .relation('room_type', () => RoomTypeFactory)
  .state('available', (room) => {
    room.status = 'available'
    room.housekeeping_status = 'inspected'
  })
  .state('clean', (room) => {
    room.status = 'available'
    room.housekeeping_status = 'clean'
  })
  .state('occupied', (room, { faker }) => {
    room.status = 'occupied'
    room.housekeeping_status = faker.helpers.arrayElement(['clean', 'dirty']) as 'clean' | 'dirty'
  })
  .state('maintenance', (room, { faker }) => {
    room.status = 'maintenance'
    room.housekeeping_status = 'out_of_service'
    room.notes.maintenance_notes = faker.helpers.arrayElement([
      'AC unit repair needed',
      'Bathroom renovation in progress',
      'Electrical work ongoing',
      'Plumbing issues',
      'Carpet replacement',
    ])
    room.metadata.maintenance_history = [
      {
        date: faker.date.recent({ days: 7 }),
        issue: room.notes.maintenance_notes,
        estimated_completion: faker.date.future({ years: 0.1 }),
      },
    ]
  })
  .state('blocked', (room, { faker }) => {
    room.status = 'blocked'
    room.notes.maintenance_notes = faker.helpers.arrayElement([
      'Reserved for VIP',
      'Long-term maintenance',
      'Staff accommodation',
      'Storage',
      'Quarantine room',
    ])
  })
  .state('needsCleaning', (room, { faker }) => {
    room.housekeeping_status = 'dirty'
    room.last_cleaned_at = DateTime.fromJSDate(faker.date.past({ years: 0.01 })) // Within last few days
  })
  .state('highFloor', (room, { faker }) => {
    const floor = faker.number.int({ min: 15, max: 30 })
    const roomOnFloor = faker.number.int({ min: 1, max: 10 })
    room.floor = floor.toString()
    room.room_number = (floor * 100 + roomOnFloor).toString()
    room.metadata.features = ['high_floor', 'panoramic_view', 'quiet_location']
  })
  .state('groundFloor', (room, { faker }) => {
    room.floor = '1'
    room.room_number = (100 + faker.number.int({ min: 1, max: 20 })).toString()
    room.metadata.features = ['easy_access', 'no_elevator_needed']
  })
  .state('suite', (room, { faker }) => {
    // Suites typically have special numbering
    const floor = faker.number.int({ min: 10, max: 20 })
    room.floor = floor.toString()
    room.room_number = floor + '01' // First room on floor is usually suite
    room.metadata.features = ['corner_room', 'high_floor', 'panoramic_view', 'extra_space']
  })
  .before('create', async () => {
    // Ensure unique room numbers within a hotel
    // This would be enforced by the database unique constraint
  })
  .after('create', async () => {
    // Room creation logged
  })
  .build()
