import type { HttpContext } from '@adonisjs/core/http'

export default class InertiaFilesController {
  async index({ inertia }: HttpContext) {
    return inertia.render('files/index')
  }
}
