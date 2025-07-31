import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

import Role from '#models/role'
import NotFoundException from '#exceptions/not_found_exception'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'

@inject()
export default class SyncRolePermissionsService {
  async handle(
    roleId: number,
    permissionIds: number[],
    trx?: TransactionClientContract
  ): Promise<void> {
    try {
      const { i18n } = HttpContext.getOrFail()
      const role = await Role.find(roleId, { client: trx })
      if (!role) {
        throw new NotFoundException(
          i18n.t('errors.not_found', {
            resource: i18n.t('models.role'),
          })
        )
      }

      // Sync permissions (this removes old permissions and adds new ones)
      await role.related('permissions').sync(permissionIds, undefined, trx)
    } catch (error) {
      // If HttpContext is not available (e.g., in migrations), fallback logic
      const role = await Role.find(roleId, { client: trx })
      if (!role) {
        throw new NotFoundException('Role not found')
      }
      await role.related('permissions').sync(permissionIds, undefined, trx)
    }
  }

  async attachPermissions(
    roleId: number,
    permissionIds: number[],
    trx?: TransactionClientContract
  ): Promise<void> {
    try {
      const { i18n } = HttpContext.getOrFail()
      const role = await Role.find(roleId, { client: trx })
      if (!role) {
        throw new NotFoundException(
          i18n.t('errors.not_found', {
            resource: i18n.t('models.role'),
          })
        )
      }

      // Attach only adds new permissions without removing existing ones
      await role.related('permissions').attach(permissionIds, trx)
    } catch (error) {
      // If HttpContext is not available (e.g., in migrations), fallback logic
      const role = await Role.find(roleId, { client: trx })
      if (!role) {
        throw new NotFoundException('Role not found')
      }
      await role.related('permissions').attach(permissionIds, trx)
    }
  }

  async detachPermissions(
    roleId: number,
    permissionIds: number[],
    trx?: TransactionClientContract
  ): Promise<void> {
    try {
      const { i18n } = HttpContext.getOrFail()
      const role = await Role.find(roleId, { client: trx })
      if (!role) {
        throw new NotFoundException(
          i18n.t('errors.not_found', {
            resource: i18n.t('models.role'),
          })
        )
      }

      // Detach removes only the specified permissions
      await role.related('permissions').detach(permissionIds, trx)
    } catch (error) {
      // If HttpContext is not available (e.g., in migrations), fallback logic
      const role = await Role.find(roleId, { client: trx })
      if (!role) {
        throw new NotFoundException('Role not found')
      }
      await role.related('permissions').detach(permissionIds, trx)
    }
  }
}
