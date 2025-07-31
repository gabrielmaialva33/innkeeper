import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

import PaginateUserService from '#services/users/paginate_user_service'
import GetUserService from '#services/users/get_user_service'
import CreateUserService from '#services/users/create_user_service'
import EditUserService from '#services/users/edit_user_service'
import DeleteUserService from '#services/users/delete_user_service'

import { createUserValidator, editUserValidator } from '#validations/users_validator'

@inject()
export default class UsersController {
  async paginate({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = request.input('per_page', 10)
    const sortBy = request.input('sort_by', 'id')
    const direction = request.input('order', 'asc')
    const search = request.input('search', undefined)

    const service = await app.container.make(PaginateUserService)
    const users = await service.run({
      page,
      perPage,
      sortBy,
      direction,
      search,
    })

    return response.json(users)
  }

  async get({ params, response }: HttpContext) {
    const userId = +params.id

    const service = await app.container.make(GetUserService)

    const user = await service.run(userId)
    if (!user) {
      return response.status(404).json({
        message: 'User not found',
      })
    }
    return response.json(user)
  }

  async create({ request, response }: HttpContext) {
    const payload = await createUserValidator.validate(request.all())

    const service = await app.container.make(CreateUserService)

    const user = await service.run(payload)
    return response.created(user)
  }

  async update({ params, request, response }: HttpContext) {
    const userId = +params.id
    const payload = await editUserValidator.validate(request.all(), { meta: { userId } })

    const service = await app.container.make(EditUserService)

    const user = await service.run(userId, payload)
    return response.json(user)
  }

  async delete({ params, response }: HttpContext) {
    const userId = +params.id

    const service = await app.container.make(DeleteUserService)
    await service.run(userId)

    return response.noContent()
  }
}
