import factory from '@adonisjs/lucid/factories'
import GroupReservation from '#models/group_reservation'
import { DateTime } from 'luxon'
import { PricingHelper } from '../helpers/pricing_helper.js'

export const GroupReservationFactory = factory
  .define(GroupReservation, async ({ faker }) => {
    // Group types and characteristics
    const groupTypes = [
      {
        type: 'wedding',
        roomRange: { min: 20, max: 100 },
        leadTime: { min: 60, max: 180 },
        eventType: 'Wedding',
        needsMeetingRooms: true,
        needsCatering: true,
      },
      {
        type: 'corporate',
        roomRange: { min: 10, max: 50 },
        leadTime: { min: 30, max: 90 },
        eventType: 'Corporate Meeting',
        needsMeetingRooms: true,
        needsCatering: faker.datatype.boolean(0.8),
      },
      {
        type: 'conference',
        roomRange: { min: 30, max: 200 },
        leadTime: { min: 90, max: 365 },
        eventType: 'Conference',
        needsMeetingRooms: true,
        needsCatering: true,
      },
      {
        type: 'tour',
        roomRange: { min: 15, max: 40 },
        leadTime: { min: 45, max: 120 },
        eventType: 'Tour Group',
        needsMeetingRooms: false,
        needsCatering: faker.datatype.boolean(0.5),
      },
      {
        type: 'sports',
        roomRange: { min: 20, max: 60 },
        leadTime: { min: 30, max: 90 },
        eventType: 'Sports Team',
        needsMeetingRooms: faker.datatype.boolean(0.3),
        needsCatering: true,
      },
      {
        type: 'association',
        roomRange: { min: 25, max: 150 },
        leadTime: { min: 120, max: 365 },
        eventType: 'Association Meeting',
        needsMeetingRooms: true,
        needsCatering: true,
      },
    ]

    const selectedGroup = faker.helpers.arrayElement(groupTypes)

    // Calculate dates based on lead time
    const arrivalDate = DateTime.fromJSDate(
      faker.date.between({
        from: DateTime.now().plus({ days: selectedGroup.leadTime.min }).toJSDate(),
        to: DateTime.now().plus({ days: selectedGroup.leadTime.max }).toJSDate(),
      })
    )

    // Cutoff date is typically 30-60 days before arrival
    const cutoff_date = arrivalDate.minus({ days: faker.number.int({ min: 30, max: 60 }) })

    // Release date is typically 7-14 days before arrival
    const release_date = arrivalDate.minus({ days: faker.number.int({ min: 7, max: 14 }) })

    // Total rooms for the group
    const total_rooms = faker.number.int(selectedGroup.roomRange)
    const blocked_rooms = total_rooms

    // Calculate pickup based on how close we are to the event
    const daysUntilArrival = arrivalDate.diffNow('days').days
    let picked_up_rooms = 0

    if (daysUntilArrival < 0) {
      // Past event
      picked_up_rooms = Math.floor(blocked_rooms * faker.number.float({ min: 0.7, max: 0.95 }))
    } else if (daysUntilArrival < 30) {
      // Close to arrival
      picked_up_rooms = Math.floor(blocked_rooms * faker.number.float({ min: 0.6, max: 0.85 }))
    } else if (daysUntilArrival < 60) {
      // Medium term
      picked_up_rooms = Math.floor(blocked_rooms * faker.number.float({ min: 0.3, max: 0.6 }))
    } else {
      // Far out
      picked_up_rooms = Math.floor(blocked_rooms * faker.number.float({ min: 0.1, max: 0.3 }))
    }

    // Calculate group rate (usually discounted)
    const baseRate = faker.number.int({ min: 100, max: 300 })
    const groupDiscount = faker.number.float({ min: 0.15, max: 0.35 }) // 15-35% discount
    const room_rate = Math.round(baseRate * (1 - groupDiscount))

    // Generate room block details
    const roomTypeCount = faker.number.int({ min: 1, max: 3 })
    const room_block = {
      room_types: Array.from({ length: roomTypeCount }, (_, i) => ({
        room_type_id: i + 1,
        quantity: Math.floor(total_rooms / roomTypeCount),
        rate: room_rate + i * 20, // Slight variation for different room types
      })),
      dates: Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, (_, i) => ({
        date: arrivalDate.plus({ days: i }).toISODate(),
        rooms: blocked_rooms,
      })),
    }

    // Event details based on group type
    const event_details = {
      event_type: selectedGroup.eventType,
      event_name:
        selectedGroup.type === 'wedding'
          ? `${faker.person.lastName()} - ${faker.person.lastName()} Wedding`
          : selectedGroup.type === 'corporate'
            ? `${faker.company.name()} ${faker.helpers.arrayElement(['Annual Meeting', 'Training', 'Team Building', 'Strategy Session'])}`
            : `${faker.company.name()} ${selectedGroup.eventType}`,
      attendees: total_rooms * faker.number.int({ min: 1, max: 2 }),
      meeting_rooms: selectedGroup.needsMeetingRooms
        ? faker.helpers.arrayElements(
            ['Ballroom A', 'Ballroom B', 'Conference Room 1', 'Conference Room 2', 'Board Room'],
            { min: 1, max: 3 }
          )
        : [],
      catering_required: selectedGroup.needsCatering,
      av_equipment: selectedGroup.needsMeetingRooms
        ? faker.helpers.arrayElements(
            ['Projector', 'Screen', 'Microphone', 'Sound System', 'Video Conference', 'Laptop'],
            { min: 2, max: 5 }
          )
        : [],
    }

    // Determine status based on dates and pickup
    let status: 'tentative' | 'confirmed' | 'cancelled' | 'completed' = 'tentative'
    if (daysUntilArrival < -7) {
      status = faker.helpers.weighted([
        ['completed', 8],
        ['cancelled', 2],
      ])
    } else if (picked_up_rooms > blocked_rooms * 0.3) {
      status = 'confirmed'
    } else if (daysUntilArrival > 90) {
      status = faker.helpers.weighted([
        ['tentative', 7],
        ['confirmed', 3],
      ])
    }

    return {
      group_code: `GRP-${faker.string.alphanumeric(8).toUpperCase()}`,
      group_name: event_details.event_name,
      company_name: selectedGroup.type === 'wedding' ? null : faker.company.name(),
      contact_name: faker.person.fullName(),
      contact_email: faker.internet.email(),
      contact_phone: faker.phone.number(),
      total_rooms,
      blocked_rooms,
      picked_up_rooms,
      room_rate,
      currency: 'USD',
      commission_percentage:
        selectedGroup.type === 'tour' ? faker.number.int({ min: 8, max: 15 }) : 0,
      cutoff_date,
      release_date,
      status,
      payment_method:
        selectedGroup.type === 'corporate'
          ? ('master_bill' as const)
          : selectedGroup.type === 'wedding'
            ? ('individual_bill' as const)
            : faker.helpers.arrayElement(['master_bill', 'individual_bill', 'mixed'] as const),
      billing_instructions: faker.datatype.boolean(0.3)
        ? faker.helpers.arrayElement([
            'Direct bill to company',
            'Split billing - 50% master, 50% individual',
            'All incidentals on individual bills',
            'Room and tax on master bill, all else individual',
          ])
        : null,
      special_requests: faker.datatype.boolean(0.5)
        ? faker.helpers
            .arrayElements(
              [
                'Welcome gift in each room',
                'Group check-in desk',
                'Late checkout for VIPs',
                'Welcome reception',
                'Daily meeting room setup',
                'Special dietary requirements',
              ],
              { min: 1, max: 3 }
            )
            .join('; ')
        : null,
      created_by_user_id: faker.number.int({ min: 1, max: 10 }),
      approved_by_user_id:
        status === 'confirmed' || status === 'completed'
          ? faker.number.int({ min: 1, max: 5 })
          : null,
      approved_at:
        status === 'confirmed' || status === 'completed'
          ? DateTime.fromJSDate(faker.date.recent({ days: 30 }))
          : null,
      is_deleted: false,
      room_block,
      event_details,
      metadata: {
        created_via: 'factory',
        group_type: selectedGroup.type,
        arrival_date: arrivalDate.toISODate(),
        departure_date: arrivalDate
          .plus({ days: faker.number.int({ min: 2, max: 5 }) })
          .toISODate(),
        negotiated_by: faker.person.fullName(),
        sales_manager: faker.person.fullName(),
      },
    }
  })
  .state('wedding', (group, { faker }) => {
    group.total_rooms = faker.number.int({ min: 30, max: 100 })
    group.blocked_rooms = group.total_rooms
    group.event_details.event_type = 'Wedding'
    group.event_details.catering_required = true
    group.payment_method = 'individual_bill'
  })
  .state('corporate', (group, { faker }) => {
    group.total_rooms = faker.number.int({ min: 10, max: 50 })
    group.blocked_rooms = group.total_rooms
    group.company_name = faker.company.name()
    group.event_details.event_type = 'Corporate Meeting'
    group.payment_method = 'master_bill'
    group.commission_percentage = 0
  })
  .state('conference', (group, { faker }) => {
    group.total_rooms = faker.number.int({ min: 50, max: 200 })
    group.blocked_rooms = group.total_rooms
    group.event_details.event_type = 'Conference'
    group.event_details.meeting_rooms = [
      'Main Ballroom',
      'Breakout Room 1',
      'Breakout Room 2',
      'Breakout Room 3',
    ]
    group.event_details.catering_required = true
  })
  .state('tentative', (group) => {
    group.status = 'tentative'
    group.picked_up_rooms = Math.floor(group.blocked_rooms * 0.1)
    group.approved_by_user_id = null
    group.approved_at = null
  })
  .state('confirmed', (group, { faker }) => {
    group.status = 'confirmed'
    group.picked_up_rooms = Math.floor(
      group.blocked_rooms * faker.number.float({ min: 0.5, max: 0.8 })
    )
    group.approved_by_user_id = faker.number.int({ min: 1, max: 5 })
    group.approved_at = DateTime.fromJSDate(faker.date.recent({ days: 14 }))
  })
  .state('completed', (group, { faker }) => {
    group.status = 'completed'
    group.picked_up_rooms = Math.floor(
      group.blocked_rooms * faker.number.float({ min: 0.7, max: 0.95 })
    )
    group.cutoff_date = DateTime.fromJSDate(faker.date.past({ years: 1 }))
    group.release_date = DateTime.fromJSDate(faker.date.past({ years: 1 }))
  })
  .build()
