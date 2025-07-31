import { BaseSchema } from '@adonisjs/lucid/schema'
import app from '@adonisjs/core/services/app'

import AssignDefaultPermissionsService from '#services/permissions/assign_default_permissions_service'

export default class extends BaseSchema {
  async up() {
    const service = await app.container.make(AssignDefaultPermissionsService)
    const trx = await this.db.transaction()
    try {
      await service.run(trx)
      await trx.commit()
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  async down() {
    // Remove all permission associations
    await this.db.from('role_permissions').delete()
    await this.db.from('user_permissions').delete()
    await this.db.from('permissions').delete()
  }
}
