import factory from '@adonisjs/lucid/factories'
import { FactoryContextContract } from '@adonisjs/lucid/types/factory'
import { DateTime } from 'luxon'
import Folio from '#models/folio'
import { ReservationFactory } from './reservation_factory.js'
import { GuestFactory } from './guest_factory.js'
import { UserFactory } from './user_factory.js'

export const FolioFactory = factory
  .define(Folio, async ({ faker }: FactoryContextContract) => {
    const folioNumber = `F${faker.date.recent().getFullYear()}${faker.string.numeric({ length: 6 })}`

    // Generate items for the folio
    const roomCharges = faker.number.float({ min: 100, max: 500, fractionDigits: 2 })
    const foodBeverage = faker.datatype.boolean({ probability: 0.6 })
      ? faker.number.float({ min: 20, max: 200, fractionDigits: 2 })
      : 0
    const minibar = faker.datatype.boolean({ probability: 0.3 })
      ? faker.number.float({ min: 10, max: 50, fractionDigits: 2 })
      : 0
    const laundry = faker.datatype.boolean({ probability: 0.2 })
      ? faker.number.float({ min: 15, max: 80, fractionDigits: 2 })
      : 0
    const spa = faker.datatype.boolean({ probability: 0.15 })
      ? faker.number.float({ min: 50, max: 300, fractionDigits: 2 })
      : 0
    const phoneCharges = faker.datatype.boolean({ probability: 0.1 })
      ? faker.number.float({ min: 5, max: 30, fractionDigits: 2 })
      : 0
    const other = faker.datatype.boolean({ probability: 0.1 })
      ? faker.number.float({ min: 10, max: 100, fractionDigits: 2 })
      : 0

    const subtotal = roomCharges + foodBeverage + minibar + laundry + spa + phoneCharges + other
    const taxRate = faker.number.float({ min: 0.08, max: 0.15, fractionDigits: 4 })
    const taxAmount = subtotal * taxRate
    const totalCharges = subtotal + taxAmount
    const totalPayments = faker.datatype.boolean({ probability: 0.7 })
      ? totalCharges
      : faker.number.float({ min: 0, max: totalCharges, fractionDigits: 2 })
    const balance = totalCharges - totalPayments

    const status: 'open' | 'closed' | 'settled' | 'disputed' = balance === 0 ? 'closed' : 'open'
    const openedAt = faker.date.recent({ days: 7 })
    const closedAt =
      status === 'closed' ? faker.date.between({ from: openedAt, to: new Date() }) : null

    return {
      organization_id: 0, // Will be set by relation
      reservation_id: 0, // Will be set by relation
      guest_id: 0, // Will be set by guest relation
      folio_number: folioNumber,
      status,
      room_charges: roomCharges,
      service_charges: foodBeverage + minibar + laundry + spa + phoneCharges + other,
      tax_amount: taxAmount,
      discount_amount: 0,
      total_amount: totalCharges,
      paid_amount: totalPayments,
      balance: balance,
      currency: 'USD',
      opened_at: DateTime.fromJSDate(openedAt),
      closed_at: closedAt ? DateTime.fromJSDate(closedAt) : null,
      closed_by_user_id: status === 'closed' ? 0 : null, // Will be set by relation if closed
      notes: faker.datatype.boolean({ probability: 0.2 })
        ? faker.helpers.arrayElement([
            'Guest requested itemized receipt',
            'Corporate billing account',
            'Split billing requested',
            'Direct billing arrangement',
            'Tax exempt - documentation on file',
          ])
        : null,
      is_deleted: false,
      metadata: {
        items: [
          {
            date: openedAt,
            category: 'room',
            description: 'Room charge',
            amount: roomCharges,
            quantity: 1,
            posted_by: 'System',
          },
          ...(foodBeverage > 0
            ? [
                {
                  date: faker.date.between({ from: openedAt, to: closedAt || new Date() }),
                  category: 'food_beverage',
                  description: faker.helpers.arrayElement([
                    'Restaurant - Breakfast',
                    'Restaurant - Lunch',
                    'Restaurant - Dinner',
                    'Room Service',
                    'Bar',
                    'Pool Bar',
                  ]),
                  amount: foodBeverage,
                  quantity: 1,
                  posted_by: faker.person.firstName(),
                },
              ]
            : []),
          ...(minibar > 0
            ? [
                {
                  date: faker.date.between({ from: openedAt, to: closedAt || new Date() }),
                  category: 'minibar',
                  description: 'Minibar charges',
                  amount: minibar,
                  quantity: 1,
                  posted_by: 'Housekeeping',
                },
              ]
            : []),
          ...(laundry > 0
            ? [
                {
                  date: faker.date.between({ from: openedAt, to: closedAt || new Date() }),
                  category: 'laundry',
                  description: faker.helpers.arrayElement([
                    'Dry cleaning',
                    'Laundry service',
                    'Express laundry',
                  ]),
                  amount: laundry,
                  quantity: faker.number.int({ min: 1, max: 5 }),
                  posted_by: 'Laundry Department',
                },
              ]
            : []),
          ...(spa > 0
            ? [
                {
                  date: faker.date.between({ from: openedAt, to: closedAt || new Date() }),
                  category: 'spa',
                  description: faker.helpers.arrayElement([
                    'Massage - Swedish',
                    'Massage - Deep Tissue',
                    'Facial Treatment',
                    'Spa Package',
                    'Manicure/Pedicure',
                  ]),
                  amount: spa,
                  quantity: 1,
                  posted_by: 'Spa',
                },
              ]
            : []),
        ],
        payment_method:
          totalPayments > 0
            ? faker.helpers.arrayElement([
                'credit_card',
                'cash',
                'bank_transfer',
                'company_account',
              ])
            : null,
        invoice_sent: status === 'closed',
        invoice_number:
          status === 'closed'
            ? `INV-${faker.string.alphanumeric({ length: 8, casing: 'upper' })}`
            : null,
        tax_details: {
          room_tax: (roomCharges * taxRate).toFixed(2),
          service_tax: ((subtotal - roomCharges) * taxRate).toFixed(2),
          tax_id: faker.datatype.boolean({ probability: 0.3 })
            ? faker.string.alphanumeric({ length: 10, casing: 'upper' })
            : null,
        },
      },
    }
  })
  .relation('reservation', () => ReservationFactory)
  .relation('guest', () => GuestFactory)
  .relation('closed_by', () => UserFactory)
  .state('open', (folio) => {
    folio.status = 'open'
    folio.paid_amount = 0
    folio.balance = folio.total_amount
    folio.closed_at = null
    folio.closed_by_user_id = null
    folio.metadata.invoice_sent = false
    folio.metadata.invoice_number = null
  })
  .state('closed', (folio, { faker }) => {
    folio.status = 'closed'
    folio.paid_amount = folio.total_amount
    folio.balance = 0
    folio.closed_at = DateTime.fromJSDate(faker.date.recent({ days: 1 }))
    folio.closed_by_user_id = 0 // Will be set by relation
    folio.metadata.invoice_sent = true
    folio.metadata.invoice_number = `INV-${faker.string.alphanumeric({ length: 8, casing: 'upper' })}`
    folio.metadata.settlement_details = {
      settled_at: folio.closed_at,
      settled_by: faker.person.fullName(),
      payment_reference: faker.string.alphanumeric({ length: 12, casing: 'upper' }),
    }
  })
  .state('partialPayment', (folio, { faker }) => {
    folio.status = 'open'
    folio.paid_amount = faker.number.float({
      min: folio.total_amount * 0.3,
      max: folio.total_amount * 0.8,
      fractionDigits: 2,
    })
    folio.balance = folio.total_amount - folio.paid_amount
    folio.metadata.payment_history = [
      {
        date: faker.date.recent({ days: 3 }),
        amount: folio.paid_amount,
        method: faker.helpers.arrayElement(['credit_card', 'cash', 'bank_transfer']),
        reference: faker.string.alphanumeric({ length: 10, casing: 'upper' }),
      },
    ]
  })
  .state('disputed', (folio, { faker }) => {
    folio.status = 'disputed'
    folio.metadata.dispute_details = {
      disputed_at: faker.date.recent({ days: 2 }),
      disputed_by: faker.person.fullName(),
      disputed_items: faker.helpers.arrayElements(
        ['room_charges', 'service_charges', 'tax_amount'],
        { min: 1, max: 2 }
      ),
      dispute_reason: faker.helpers.arrayElement([
        'Incorrect charges',
        'Service not provided',
        'Duplicate charges',
        'Quality issues',
        'Rate discrepancy',
        'Unauthorized charges',
      ]),
      resolution_status: faker.helpers.arrayElement(['pending', 'investigating', 'resolved']),
    }
  })
  .state('highSpender', (folio, { faker }) => {
    // Luxury spending pattern
    const roomCharges = faker.number.float({ min: 500, max: 2000, fractionDigits: 2 })
    const serviceCharges = faker.number.float({ min: 500, max: 2000, fractionDigits: 2 })

    folio.room_charges = roomCharges
    folio.service_charges = serviceCharges
    folio.tax_amount = (roomCharges + serviceCharges) * 0.12
    folio.total_amount = roomCharges + serviceCharges + folio.tax_amount
    folio.paid_amount = folio.total_amount
    folio.balance = 0

    folio.metadata.vip_amenities = true
    folio.metadata.special_requests_fulfilled = [
      'Champagne on arrival',
      'Late checkout granted',
      'Spa credit applied',
      'Room upgrade provided',
    ]
    folio.metadata.service_breakdown = {
      food_beverage: faker.number.float({ min: 200, max: 800, fractionDigits: 2 }),
      minibar: faker.number.float({ min: 50, max: 200, fractionDigits: 2 }),
      spa: faker.number.float({ min: 200, max: 600, fractionDigits: 2 }),
      other: faker.number.float({ min: 50, max: 400, fractionDigits: 2 }),
    }
  })
  .state('corporate', (folio, { faker }) => {
    folio.metadata.billing_type = 'corporate'
    folio.metadata.company_name = faker.company.name()
    folio.metadata.company_tax_id = faker.string.alphanumeric({ length: 10, casing: 'upper' })
    folio.metadata.purchase_order = faker.string.alphanumeric({ length: 12, casing: 'upper' })
    folio.metadata.cost_center = faker.string.numeric({ length: 6 })
    folio.notes = 'Corporate direct billing - Net 30 terms'
  })
  .before('create', async (_factory, folio) => {
    // Ensure balance is calculated correctly
    folio.balance = folio.total_amount - folio.paid_amount

    // Set closed_at for closed folios
    if (folio.status === 'closed' && !folio.closed_at) {
      folio.closed_at = DateTime.now()
    }
  })
  .build()
