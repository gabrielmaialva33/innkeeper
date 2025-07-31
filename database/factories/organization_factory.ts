import factory from '@adonisjs/lucid/factories'
import { FactoryContextContract } from '@adonisjs/lucid/types/factory'
import Organization from '#models/organization'

export const OrganizationFactory = factory
  .define(Organization, async ({ faker }: FactoryContextContract) => {
    const hotelTypes = ['Hotel Chain', 'Resort Group', 'Boutique Hotels', 'Business Hotels']
    const companyType = faker.helpers.arrayElement(hotelTypes)

    const name = faker.company.name() + ' ' + companyType

    return {
      name,
      slug: faker.helpers.slugify(name).toLowerCase(),
      email: faker.internet.email({ provider: faker.helpers.slugify(name).toLowerCase() + '.com' }),
      settings: {
        overbooking_percentage: faker.number.int({ min: 5, max: 15 }),
        default_check_in_time: faker.helpers.arrayElement(['14:00', '15:00', '16:00']),
        default_check_out_time: faker.helpers.arrayElement(['10:00', '11:00', '12:00']),
        cancellation_policy: faker.helpers.arrayElement(['flexible', 'moderate', 'strict']),
        payment_methods: faker.helpers.arrayElements(
          ['cash', 'credit_card', 'debit_card', 'bank_transfer', 'online'],
          { min: 2, max: 5 }
        ),
        supported_languages: faker.helpers.arrayElements(
          ['en', 'pt', 'es', 'fr', 'de', 'ja', 'zh'],
          { min: 1, max: 4 }
        ),
        night_audit_time: faker.helpers.arrayElement(['00:00', '01:00', '02:00', '03:00']),
      },
      is_active: true,
    }
  })
  .state('smallHotel', (organization, { faker }) => {
    organization.name = faker.company.name() + ' Inn'
    organization.settings.overbooking_percentage = 0
    organization.settings.payment_methods = ['cash', 'credit_card']
  })
  .state('hotelChain', (organization, { faker }) => {
    organization.name = faker.company.name() + ' International Hotels'
    organization.settings.overbooking_percentage = 10
    organization.settings.payment_methods = ['credit_card', 'debit_card', 'bank_transfer', 'online']
  })
  .state('resort', (organization, { faker }) => {
    organization.name = faker.company.name() + ' Resorts & Spa'
    organization.settings.cancellation_policy = 'strict'
    organization.settings.default_check_in_time = '16:00'
    organization.settings.default_check_out_time = '10:00'
  })
  .state('boutique', (organization, { faker }) => {
    organization.name = faker.company.name() + ' Boutique Collection'
    organization.settings.overbooking_percentage = 0
  })
  .build()
