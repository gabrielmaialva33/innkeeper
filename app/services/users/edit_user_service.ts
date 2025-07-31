import { inject } from '@adonisjs/core'
import UsersRepository from '#repositories/users_repository'
import IUser from '#interfaces/user_interface'
import User from '#models/user'

@inject()
export default class EditUserService {
  constructor(private userRepository: UsersRepository) {}

  async run(userId: number, payload: IUser.EditPayload): Promise<User | null> {
    // Filter out email and username to prevent updates
    const { email, username, ...allowedPayload } = payload
    return this.userRepository.update('id', userId, allowedPayload)
  }
}
