import factory from '@adonisjs/lucid/factories'
import { FactoryContextContract } from '@adonisjs/lucid/types/factory'
import { DateTime } from 'luxon'
import Guest from '#models/guest'

export const GuestFactory = factory
  .define(Guest, async ({ faker }: FactoryContextContract) => {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const nationality = faker.location.countryCode('alpha-2')

    // Generate realistic document numbers based on type
    const documentTypes = {
      passport: () => faker.string.alphanumeric({ length: 9, casing: 'upper' }),
      id_card: () => faker.string.numeric({ length: 11 }),
      driver_license: () => faker.string.alphanumeric({ length: 12, casing: 'upper' }),
    }

    const documentType = faker.helpers.objectKey(documentTypes) as keyof typeof documentTypes
    const documentNumber = documentTypes[documentType]()

    const birthDate = faker.date.birthdate({ min: 18, max: 80, mode: 'age' })

    return {
      organization_id: 0, // Will be set by relation
      user_id: null,
      first_name: firstName,
      last_name: lastName,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      phone: faker.phone.number({ style: 'international' }),
      mobile: faker.datatype.boolean({ probability: 0.7 })
        ? faker.phone.number({ style: 'international' })
        : null,
      document_type: documentType as 'passport' | 'id_card' | 'driver_license' | 'other',
      document_number: documentNumber,
      document_issuer: faker.location.country(),
      document_expiry_date: DateTime.fromJSDate(faker.date.future({ years: 5 })),
      date_of_birth: DateTime.fromJSDate(birthDate),
      gender: faker.helpers.arrayElement(['male', 'female', 'other', null]),
      nationality,
      address: JSON.stringify({
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        country: faker.location.country(),
        postal_code: faker.location.zipCode(),
      }),
      preferences: {
        room_preference: faker.helpers.arrayElement(['standard', 'deluxe', 'suite']),
        floor_preference: faker.helpers.arrayElement(['low', 'middle', 'high', 'no_preference']),
        bed_preference: faker.helpers.arrayElement(['king', 'queen', 'twin']),
        smoking_preference: faker.datatype.boolean({ probability: 0.1 }),
        dietary_restrictions: faker.helpers.arrayElements(
          [
            'vegetarian',
            'vegan',
            'gluten_free',
            'kosher',
            'halal',
            'nut_allergy',
            'lactose_intolerant',
          ],
          { min: 0, max: 2 }
        ),
        special_requests: faker.datatype.boolean({ probability: 0.3 })
          ? faker.helpers.arrayElement([
              'Early check-in requested',
              'Late check-out requested',
              'Quiet room please',
              'Near elevator',
              'Away from elevator',
              'Honeymoon special setup',
              'Birthday celebration',
              'Extra pillows',
              'Hypoallergenic bedding',
            ])
          : null,
        language: faker.helpers.arrayElement(['en', 'es', 'pt', 'fr', 'de', 'zh', 'ja']),
      },
      loyalty_number: faker.datatype.boolean({ probability: 0.4 })
        ? faker.string.alphanumeric({ length: 10, casing: 'upper' })
        : null,
      loyalty_points: faker.number.int({ min: 0, max: 10000 }),
      is_blacklisted: false,
      blacklist_reason: null,
      is_deleted: false,
      metadata: {
        total_stays: faker.number.int({ min: 0, max: 50 }),
        total_spent: faker.number.float({ min: 0, max: 50000, fractionDigits: 2 }),
        average_stay_length: faker.number.float({ min: 1, max: 7, fractionDigits: 1 }),
        last_stay_date: faker.date.recent({ days: 365 }),
        source: faker.helpers.arrayElement([
          'direct',
          'booking.com',
          'expedia',
          'airbnb',
          'phone',
          'walk-in',
        ]),
        marketing_consent: faker.datatype.boolean({ probability: 0.6 }),
      },
    }
  })
  .state('vip', (guest, { faker }) => {
    guest.loyalty_number = faker.string.alphanumeric({ length: 10, casing: 'upper' })
    guest.loyalty_points = faker.number.int({ min: 10000, max: 100000 })
    guest.metadata.total_stays = faker.number.int({ min: 20, max: 100 })
    guest.metadata.total_spent = faker.number.float({ min: 20000, max: 200000, fractionDigits: 2 })
    guest.metadata.tags = ['vip', 'frequent_guest', 'high_value']
    guest.preferences.room_preference = faker.helpers.arrayElement(['suite', 'presidential'])
  })
  .state('regular', (guest, { faker }) => {
    guest.metadata.total_stays = faker.number.int({ min: 2, max: 10 })
    guest.metadata.total_spent = faker.number.float({ min: 1000, max: 10000, fractionDigits: 2 })
    guest.metadata.tags = ['regular', 'returning_guest']
  })
  .state('corporate', (guest, { faker }) => {
    const company = faker.company.name()
    guest.email = faker.internet.email({
      firstName: guest.first_name,
      lastName: guest.last_name,
      provider: faker.helpers.slugify(company).toLowerCase() + '.com',
    })
    guest.metadata.tags = ['corporate', 'business']
    guest.metadata.company = company
    guest.metadata.corporate_id = faker.string.alphanumeric({ length: 8, casing: 'upper' })
    guest.preferences.special_requests = 'Invoice to company'
  })
  .state('blacklisted', (guest, { faker }) => {
    guest.is_blacklisted = true
    guest.metadata.blacklist_reason = faker.helpers.arrayElement([
      'Payment issues',
      'Property damage',
      'Disturbing other guests',
      'Policy violations',
      'Fraud attempt',
    ])
    guest.metadata.blacklist_date = faker.date.recent({ days: 180 })
  })
  .state('firstTime', (guest) => {
    guest.metadata.total_stays = 0
    guest.metadata.total_spent = 0
    guest.metadata.tags = ['first_time', 'new_guest']
  })
  .state('family', (guest, { faker }) => {
    guest.metadata.tags = ['family', 'leisure']
    guest.preferences.room_preference = faker.helpers.arrayElement([
      'deluxe',
      'suite',
      'family_room',
    ])
    guest.metadata.family_size = faker.number.int({ min: 3, max: 6 })
    guest.metadata.has_children = true
    guest.metadata.children_ages = Array.from(
      { length: faker.number.int({ min: 1, max: 3 }) },
      () => faker.number.int({ min: 1, max: 17 })
    )
  })
  .build()
