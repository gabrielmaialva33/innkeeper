import type { HttpContext } from '@adonisjs/core/http'

export default class InertiaDashboardController {
  async index({ inertia, auth }: HttpContext) {
    await auth.use('jwt').authenticate()

    return inertia.render('dashboard')
  }
}
