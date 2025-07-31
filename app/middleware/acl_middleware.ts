import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

import ForbiddenException from '#exceptions/forbidden_exception'
import IRole from '#interfaces/role_interface'

export default class AclMiddleware {
  async handle({ auth, i18n }: HttpContext, next: NextFn, opts: { role_slugs: IRole.Slugs[] }) {
    // Get an authenticated user
    const user = auth.user

    if (!user) {
      throw new ForbiddenException(i18n.t('errors.permission_denied'))
    }

    // Load roles if not already loaded
    if (!user.$preloaded?.roles) {
      await user.load((loader) => {
        loader.load('roles')
      })
    }

    const hasNecessaryRole = user.roles.some((role: { slug: IRole.Slugs }) =>
      opts.role_slugs.includes(role.slug)
    )

    if (hasNecessaryRole) {
      return next()
    }

    throw new ForbiddenException(i18n.t('errors.permission_denied'))
  }
}
