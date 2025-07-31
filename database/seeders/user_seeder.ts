import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { UserFactory } from '#database/factories/user_factory'

export default class extends BaseSeeder {
  static environment = ['development']

  async run() {
    await UserFactory.merge({
      password: '123456',
    }).createMany(10)
  }
}
