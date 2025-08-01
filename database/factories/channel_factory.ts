import factory from '@adonisjs/lucid/factories'
import Channel from '#models/channel'

export const ChannelFactory = factory
  .define(Channel, async ({ faker }) => {
    // Define common OTA and distribution channels
    const channelTypes = [
      {
        type: 'ota' as const,
        examples: [
          { name: 'Booking.com', code: 'BOOKING', commission: 15, payment: 'mixed' as const },
          { name: 'Expedia Group', code: 'EXPEDIA', commission: 18, payment: 'prepaid' as const },
          { name: 'Hotels.com', code: 'HOTELS', commission: 17, payment: 'prepaid' as const },
          { name: 'Agoda', code: 'AGODA', commission: 15, payment: 'mixed' as const },
          { name: 'Airbnb', code: 'AIRBNB', commission: 3, payment: 'prepaid' as const },
          { name: 'Trip.com', code: 'TRIP', commission: 12, payment: 'prepaid' as const },
        ],
      },
      {
        type: 'gds' as const,
        examples: [
          { name: 'Amadeus', code: 'AMADEUS', commission: 10, payment: 'hotel_collect' as const },
          { name: 'Sabre', code: 'SABRE', commission: 10, payment: 'hotel_collect' as const },
          { name: 'Galileo', code: 'GALILEO', commission: 10, payment: 'hotel_collect' as const },
          {
            name: 'Worldspan',
            code: 'WORLDSPAN',
            commission: 10,
            payment: 'hotel_collect' as const,
          },
        ],
      },
      {
        type: 'direct' as const,
        examples: [
          { name: 'Hotel Website', code: 'WEBSITE', commission: 0, payment: 'prepaid' as const },
          { name: 'Call Center', code: 'CALL', commission: 0, payment: 'mixed' as const },
          { name: 'Walk-in', code: 'WALKIN', commission: 0, payment: 'hotel_collect' as const },
          { name: 'Email', code: 'EMAIL', commission: 0, payment: 'mixed' as const },
        ],
      },
      {
        type: 'corporate' as const,
        examples: [
          {
            name: 'Corporate Travel',
            code: 'CORP',
            commission: 5,
            payment: 'hotel_collect' as const,
          },
          {
            name: 'Business Direct',
            code: 'BIZDIR',
            commission: 0,
            payment: 'hotel_collect' as const,
          },
          { name: 'Consortia', code: 'CONSORT', commission: 8, payment: 'hotel_collect' as const },
        ],
      },
      {
        type: 'wholesaler' as const,
        examples: [
          { name: 'Hotelbeds', code: 'HOTELBEDS', commission: 20, payment: 'prepaid' as const },
          { name: 'GTA Travel', code: 'GTA', commission: 22, payment: 'prepaid' as const },
          { name: 'Tourico', code: 'TOURICO', commission: 25, payment: 'prepaid' as const },
        ],
      },
    ]

    const selectedType = faker.helpers.arrayElement(channelTypes)
    const selectedChannel = faker.helpers.arrayElement(selectedType.examples)

    // API configuration based on channel type
    const api_config = {
      endpoint: selectedType.type === 'direct' ? '' : faker.internet.url({ protocol: 'https' }),
      auth_type: faker.helpers.arrayElement(['basic', 'oauth', 'token', 'key'] as const),
      credentials: {
        username: selectedType.type !== 'direct' ? faker.internet.userName() : '',
        password: selectedType.type !== 'direct' ? faker.string.alphanumeric(32) : '',
        api_key: selectedType.type !== 'direct' ? faker.string.alphanumeric(40) : '',
      },
      webhook_url:
        selectedType.type === 'ota' || selectedType.type === 'gds'
          ? faker.internet.url({ protocol: 'https' })
          : null,
      rate_limit: faker.number.int({ min: 10, max: 1000 }),
      timeout: faker.number.int({ min: 30, max: 120 }),
    }

    // Mapping configuration
    const mapping_config = {
      room_type_mapping:
        selectedType.type !== 'direct'
          ? {
              STD: 'Standard Room',
              DLX: 'Deluxe Room',
              STE: 'Suite',
              PRES: 'Presidential Suite',
            }
          : {},
      rate_plan_mapping:
        selectedType.type !== 'direct'
          ? {
              BAR: 'Best Available Rate',
              PKG: 'Package Rate',
              CORP: 'Corporate Rate',
            }
          : {},
      amenity_mapping:
        selectedType.type === 'ota'
          ? {
              WIFI: 'wifi',
              BREAKFAST: 'breakfast_included',
              PARKING: 'free_parking',
              POOL: 'swimming_pool',
            }
          : {},
      payment_mapping: {
        CC: 'credit_card',
        CASH: 'cash',
        BANK: 'bank_transfer',
      },
    }

    // Channel capabilities based on type
    const isOta = selectedType.type === 'ota'
    const isGds = selectedType.type === 'gds'
    const isDirect = selectedType.type === 'direct'

    return {
      name: selectedChannel.name,
      code: selectedChannel.code,
      type: selectedType.type,
      description: faker.lorem.sentence(),
      website:
        selectedType.type !== 'direct'
          ? faker.internet.url({ protocol: 'https' })
          : faker.datatype.boolean(0.5)
            ? faker.internet.url({ protocol: 'https' })
            : null,
      support_email: faker.internet.email(),
      support_phone: faker.phone.number(),
      commission_percentage: selectedChannel.commission,
      payment_terms: selectedChannel.payment,
      booking_fee:
        selectedType.type === 'ota' ? faker.number.float({ min: 0, max: 5, multipleOf: 0.5 }) : 0,
      is_active: faker.datatype.boolean(0.9), // 90% active
      supports_room_mapping: !isDirect,
      supports_rate_mapping: !isDirect,
      supports_availability_sync: isOta || isGds,
      supports_booking_delivery: true,
      supports_modification: isOta || isDirect,
      supports_cancellation: true,
      api_config,
      mapping_config,
      metadata: {
        created_via: 'factory',
        channel_category: selectedType.type,
        market_segment: faker.helpers.arrayElement(['leisure', 'business', 'group', 'all']),
        contract_start: faker.date.past({ years: 2 }),
        contract_end: faker.date.future({ years: 2 }),
      },
    }
  })
  .state('ota', (channel, { faker }) => {
    channel.type = 'ota'
    channel.supports_room_mapping = true
    channel.supports_rate_mapping = true
    channel.supports_availability_sync = true
    channel.commission_percentage = faker.number.int({ min: 12, max: 20 })
  })
  .state('gds', (channel) => {
    channel.type = 'gds'
    channel.commission_percentage = 10
    channel.payment_terms = 'hotel_collect'
    channel.supports_availability_sync = true
  })
  .state('direct', (channel) => {
    channel.type = 'direct'
    channel.commission_percentage = 0
    channel.booking_fee = 0
    channel.supports_room_mapping = false
    channel.supports_rate_mapping = false
    channel.supports_availability_sync = false
  })
  .state('booking', (channel) => {
    channel.name = 'Booking.com'
    channel.code = 'BOOKING'
    channel.type = 'ota'
    channel.commission_percentage = 15
    channel.payment_terms = 'mixed'
  })
  .state('expedia', (channel) => {
    channel.name = 'Expedia Group'
    channel.code = 'EXPEDIA'
    channel.type = 'ota'
    channel.commission_percentage = 18
    channel.payment_terms = 'prepaid'
  })
  .state('website', (channel) => {
    channel.name = 'Hotel Website'
    channel.code = 'WEBSITE'
    channel.type = 'direct'
    channel.commission_percentage = 0
    channel.payment_terms = 'prepaid'
  })
  .build()
