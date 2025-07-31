import { inject } from '@adonisjs/core'
import UsersRepository from '#repositories/users_repository'

@inject()
export default class DeleteUserService {
  constructor(private userRepository: UsersRepository) {}

  async run(userId: number): Promise<void> {
    await this.userRepository.softDelete('id', userId)
  }
}
