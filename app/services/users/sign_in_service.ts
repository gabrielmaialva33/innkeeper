import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import JwtAuthTokensService, {
  GenerateAuthTokensResponse,
} from '#services/users/jwt_auth_tokens_service'
import UsersRepository from '#repositories/users_repository'
import AuthEventService from '#services/users/auth_event_service'
import User from '#models/user'

type SignInRequest = {
  uid: string
  password: string
  ctx: HttpContext
}

type SignInResponse = User & {
  auth: GenerateAuthTokensResponse
}

@inject()
export default class SignInService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtAuthTokensService: JwtAuthTokensService
  ) {}

  async run({ uid, password, ctx }: SignInRequest): Promise<SignInResponse> {
    // Emit login attempted event
    AuthEventService.emitLoginAttempted(uid, ctx)

    try {
      const user = await this.usersRepository.verifyCredentials(uid, password)
      await user.load('roles')

      const auth = await this.jwtAuthTokensService.run({ userId: user.id })
      const userJson = user.toJSON()

      // Check if the user is admin
      const isAdmin = user.roles.some((role) => role.name === 'ADMIN' || role.name === 'ROOT')

      // Emit login succeeded event
      AuthEventService.emitLoginSucceeded(user, 'password', isAdmin, ctx)

      return { ...userJson, auth } as SignInResponse
    } catch (error) {
      // Emit login failed event
      AuthEventService.emitLoginFailed(uid, error.message || 'Invalid credentials', ctx)
      throw error
    }
  }
}
