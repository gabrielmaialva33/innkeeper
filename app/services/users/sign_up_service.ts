import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

import UsersRepository from '#repositories/users_repository'
import JwtAuthTokensService from '#services/users/jwt_auth_tokens_service'
import SendVerificationEmailService from '#services/users/send_verification_email_service'
import IUser from '#interfaces/user_interface'
import AuthEventService from '#services/users/auth_event_service'

@inject()
export default class SignUpService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtAuthTokensService: JwtAuthTokensService,
    private sendVerificationEmailService: SendVerificationEmailService
  ) {}

  async run(payload: IUser.CreatePayload) {
    const ctx = HttpContext.getOrFail()

    const user = await this.usersRepository.create(payload)
    await user.load('roles')

    // Send verification email
    await this.sendVerificationEmailService.handle(user)

    const auth = await this.jwtAuthTokensService.run({ userId: user.id })

    // Emit user registered event
    AuthEventService.emitUserRegistered(user, 'sign-up', false, ctx)

    // Emit login succeeded event (auto-login after registration)
    const isAdmin = user.roles.some((role) => role.name === 'ADMIN' || role.name === 'ROOT')
    AuthEventService.emitLoginSucceeded(user, 'password', isAdmin, ctx)

    const userJson = user.toJSON()

    return { ...userJson, auth }
  }
}
