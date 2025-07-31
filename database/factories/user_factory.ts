import factory from '@adonisjs/lucid/factories'
import { FactoryContextContract } from '@adonisjs/lucid/types/factory'

import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export const UserFactory = factory
  .define(User, async ({ faker }: FactoryContextContract) => {
    return {
      full_name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: await hash.make(faker.internet.password()),
    }
  })
  .build()
