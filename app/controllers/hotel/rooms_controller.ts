import type { HttpContext } from '@adonisjs/core/http'

export default class RoomsController {
  async index({ inertia, auth }: HttpContext) {
    await auth.use('jwt').authenticate()

    // In a real app, you would fetch rooms data from your service layer
    return inertia.render('hotel/rooms')
  }
}
