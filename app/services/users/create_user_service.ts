import { inject } from '@adonisjs/core'
import UsersRepository from '#repositories/users_repository'
import IUser from '#interfaces/user_interface'

@inject()
export default class CreateUserService {
  constructor(private userRepository: UsersRepository) {}

  async run(payload: IUser.CreatePayload) {
    return this.userRepository.create(payload)
  }
}
