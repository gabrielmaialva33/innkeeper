import { inject } from '@adonisjs/core'
import UsersRepository from '#repositories/users_repository'
import User from '#models/user'

@inject()
export default class GetUserService {
  constructor(private userRepository: UsersRepository) {}

  async run(userId: number): Promise<User | null> {
    return this.userRepository.findBy('id', userId, {
      modifyQuery: (query) => query.preload('roles'),
    })
  }
}
