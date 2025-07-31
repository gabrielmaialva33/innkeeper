import { inject } from '@adonisjs/core'
import app from '@adonisjs/core/services/app'
import GetUserService from '#services/users/get_user_service'
import NotFoundException from '#exceptions/not_found_exception'

type SyncRolesRequest = {
  userId: number
  roleIds: number[]
}

@inject()
export default class SyncRolesService {
  constructor() {}

  async run({ userId, roleIds }: SyncRolesRequest) {
    const getUserService = await app.container.make(GetUserService)
    const user = await getUserService.run(userId)
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`)
    }

    await user.related('roles').sync(roleIds)
  }
}
