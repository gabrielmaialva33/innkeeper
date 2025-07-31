import factory from '@adonisjs/lucid/factories'
import { FactoryContextContract } from '@adonisjs/lucid/types/factory'
import { DateTime } from 'luxon'
import Payment from '#models/payment'
import { ReservationFactory } from './reservation_factory.js'
import { FolioFactory } from './folio_factory.js'
import { GuestFactory } from './guest_factory.js'
import { UserFactory } from './user_factory.js'

export const PaymentFactory = factory
  .define(Payment, async ({ faker }: FactoryContextContract) => {
    const transactionId = faker.string.alphanumeric({ length: 12, casing: 'upper' })

    const paymentMethods = {
      cash: { gateway: null, cardInfo: false },
      credit_card: {
        gateway: faker.helpers.arrayElement(['stripe', 'square', 'paypal']),
        cardInfo: true,
      },
      debit_card: { gateway: faker.helpers.arrayElement(['stripe', 'square']), cardInfo: true },
      bank_transfer: { gateway: 'wire_transfer', cardInfo: false },
      check: { gateway: null, cardInfo: false },
      online: {
        gateway: faker.helpers.arrayElement(['paypal', 'venmo', 'zelle']),
        cardInfo: false,
      },
      other: { gateway: null, cardInfo: false },
    }

    const method = faker.helpers.objectKey(paymentMethods) as keyof typeof paymentMethods
    const methodInfo = paymentMethods[method]

    const amount = faker.number.float({ min: 50, max: 2000, fractionDigits: 2 })
    const currency = 'USD'
    const exchangeRate =
      currency === 'USD' ? 1 : faker.number.float({ min: 0.8, max: 1.2, fractionDigits: 6 })

    const status = faker.helpers.weightedArrayElement([
      { value: 'completed', weight: 70 },
      { value: 'pending', weight: 15 },
      { value: 'processing', weight: 5 },
      { value: 'failed', weight: 5 },
      { value: 'cancelled', weight: 3 },
      { value: 'refunded', weight: 2 },
    ])

    return {
      organization_id: 0, // Will be set by relation
      reservation_id: 0, // Will be set by relation or null
      folio_id: 0, // Will be set by relation or null
      guest_id: 0, // Will be set by relation
      processed_by_user_id: 0, // Will be set by relation
      transaction_id: transactionId,
      type: faker.helpers.arrayElement(['payment', 'refund', 'deposit', 'advance']),
      method,
      status,
      amount,
      currency,
      exchange_rate: exchangeRate,
      base_currency_amount: amount * exchangeRate,
      gateway: methodInfo.gateway,
      gateway_transaction_id: methodInfo.gateway ? faker.string.alphanumeric({ length: 20 }) : null,
      gateway_response: methodInfo.gateway
        ? JSON.stringify({
            status: 'success',
            processor_response: faker.string.alphanumeric({ length: 6 }),
            authorization_code: faker.string.alphanumeric({ length: 6, casing: 'upper' }),
            avs_response: faker.helpers.arrayElement(['Y', 'A', 'N']),
            cvv_response: faker.helpers.arrayElement(['M', 'N', 'P']),
          })
        : null,
      card_last_four: methodInfo.cardInfo ? faker.string.numeric({ length: 4 }) : null,
      card_brand: methodInfo.cardInfo
        ? faker.helpers.arrayElement(['visa', 'mastercard', 'amex', 'discover'])
        : null,
      reference_number: faker.string.alphanumeric({ length: 10, casing: 'upper' }),
      notes: faker.datatype.boolean({ probability: 0.2 })
        ? faker.helpers.arrayElement([
            'Payment for room charges',
            'Deposit payment',
            'Balance payment',
            'Additional services',
            'Damage compensation',
            'Late checkout fee',
          ])
        : null,
      receipt_number:
        status === 'completed' ? faker.string.alphanumeric({ length: 8, casing: 'upper' }) : null,
      paid_at: status === 'completed' ? DateTime.fromJSDate(faker.date.recent({ days: 7 })) : null,
      failed_at: status === 'failed' ? DateTime.fromJSDate(faker.date.recent({ days: 2 })) : null,
      failure_reason:
        status === 'failed'
          ? faker.helpers.arrayElement([
              'Insufficient funds',
              'Card declined',
              'Invalid card number',
              'Expired card',
              'Transaction limit exceeded',
              'Bank connection error',
            ])
          : null,
      is_deleted: false,
      metadata: {
        ip_address: faker.internet.ipv4(),
        user_agent: faker.internet.userAgent(),
        payment_source: faker.helpers.arrayElement(['front_desk', 'online', 'mobile_app', 'kiosk']),
        pos_terminal:
          method === 'credit_card' || method === 'debit_card'
            ? faker.string.alphanumeric({ length: 8 })
            : null,
        invoice_number: faker.datatype.boolean({ probability: 0.7 })
          ? faker.string.alphanumeric({ length: 10, casing: 'upper' })
          : null,
        tax_amount: faker.number.float({ min: 5, max: 100, fractionDigits: 2 }),
        tip_amount:
          method === 'credit_card' && faker.datatype.boolean({ probability: 0.3 })
            ? faker.number.float({ min: 5, max: 50, fractionDigits: 2 })
            : 0,
        processing_fee: methodInfo.gateway
          ? faker.number.float({ min: 0.5, max: 5, fractionDigits: 2 })
          : 0,
      },
    }
  })
  .relation('reservation', () => ReservationFactory)
  .relation('folio', () => FolioFactory)
  .relation('guest', () => GuestFactory)
  .relation('processedBy', () => UserFactory)
  .state('cash', (payment) => {
    payment.method = 'cash'
    payment.status = 'completed'
    payment.gateway = null
    payment.gateway_transaction_id = null
    payment.card_last_four = null
    payment.card_brand = null
    payment.metadata.requires_change = payment.amount % 10 !== 0
  })
  .state('creditCard', (payment, { faker }) => {
    payment.method = 'credit_card'
    payment.gateway = faker.helpers.arrayElement(['stripe', 'square', 'paypal'])
    payment.gateway_transaction_id = faker.string.alphanumeric({ length: 20 })
    payment.card_last_four = faker.string.numeric({ length: 4 })
    payment.card_brand = faker.helpers.arrayElement(['visa', 'mastercard', 'amex', 'discover'])
    payment.metadata.card_type = faker.helpers.arrayElement(['personal', 'corporate'])
    payment.metadata.entry_mode = faker.helpers.arrayElement([
      'chip',
      'swipe',
      'contactless',
      'manual',
    ])
  })
  .state('debit', (payment, { faker }) => {
    payment.method = 'debit_card'
    payment.gateway = faker.helpers.arrayElement(['stripe', 'square'])
    payment.gateway_transaction_id = faker.string.alphanumeric({ length: 20 })
    payment.card_last_four = faker.string.numeric({ length: 4 })
    payment.card_brand = faker.helpers.arrayElement(['visa', 'mastercard'])
    payment.metadata.pin_verified = true
  })
  .state('bankTransfer', (payment, { faker }) => {
    payment.method = 'bank_transfer'
    payment.gateway = 'wire_transfer'
    payment.status = faker.helpers.arrayElement(['pending', 'processing', 'completed'])
    payment.metadata.bank_name = faker.company.name() + ' Bank'
    payment.metadata.transfer_reference = faker.string.alphanumeric({ length: 16, casing: 'upper' })
    payment.metadata.estimated_arrival = faker.date.future({ years: 0.01 })
  })
  .state('online', (payment, { faker }) => {
    payment.method = 'online'
    payment.gateway = faker.helpers.arrayElement(['paypal', 'venmo', 'zelle', 'cashapp'])
    payment.gateway_transaction_id = faker.string.alphanumeric({ length: 16 })
    payment.metadata.payer_email = faker.internet.email()
    payment.metadata.payer_id = faker.string.alphanumeric({ length: 12 })
  })
  .state('completed', (payment, { faker }) => {
    payment.status = 'completed'
    payment.paid_at = DateTime.fromJSDate(faker.date.recent({ days: 7 }))
    payment.receipt_number = faker.string.alphanumeric({ length: 8, casing: 'upper' })
    payment.failed_at = null
    payment.failure_reason = null
  })
  .state('failed', (payment, { faker }) => {
    payment.status = 'failed'
    payment.failed_at = DateTime.fromJSDate(faker.date.recent({ days: 2 }))
    payment.failure_reason = faker.helpers.arrayElement([
      'Insufficient funds',
      'Card declined',
      'Invalid card number',
      'Expired card',
      'Transaction limit exceeded',
      'Bank connection error',
      'Fraud suspected',
    ])
    payment.paid_at = null
    payment.receipt_number = null
    payment.metadata.retry_count = faker.number.int({ min: 1, max: 3 })
  })
  .state('refund', (payment, { faker }) => {
    payment.type = 'refund'
    payment.status = 'completed'
    payment.amount = -Math.abs(payment.amount) // Negative amount for refunds
    payment.base_currency_amount = payment.amount * payment.exchange_rate
    payment.metadata.original_payment_id = faker.string.alphanumeric({
      length: 12,
      casing: 'upper',
    })
    payment.metadata.refund_reason = faker.helpers.arrayElement([
      'Cancellation within policy',
      'Service not provided',
      'Overcharge',
      'Guest complaint',
      'Duplicate payment',
    ])
  })
  .state('deposit', (payment) => {
    payment.type = 'deposit'
    payment.notes = 'Security deposit'
    payment.metadata.refundable = true
    payment.metadata.hold_until = DateTime.now().plus({ days: 7 }).toISO()
  })
  .before('create', async (_factory, payment) => {
    // Ensure refunds have negative amounts
    if (payment.type === 'refund' && payment.amount > 0) {
      payment.amount = -payment.amount
      payment.base_currency_amount = payment.amount * payment.exchange_rate
    }

    // Set paid_at for completed payments
    if (payment.status === 'completed' && !payment.paid_at) {
      payment.paid_at = DateTime.now()
    }
  })
  .build()
