import { inject } from '@adonisjs/core'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'

import CreateDefaultPermissionsService from '#services/permissions/create_default_permissions_service'
import SyncRolePermissionsService from '#services/permissions/sync_role_permissions_service'
import Role from '#models/role'
import Permission from '#models/permission'

import IRole from '#interfaces/role_interface'
import IPermission from '#interfaces/permission_interface'

@inject()
export default class AssignDefaultPermissionsService {
  constructor(
    private createDefaultPermissionsService: CreateDefaultPermissionsService,
    private syncRolePermissionsService: SyncRolePermissionsService
  ) {}

  async run(trx?: TransactionClientContract): Promise<void> {
    // First, create all default permissions
    await this.createDefaultPermissionsService.run(trx)

    // Then assign permissions to roles
    await this.assignPermissionsToRoles(trx)
  }

  private async assignPermissionsToRoles(trx?: TransactionClientContract): Promise<void> {
    // ROOT - All permissions
    await this.assignRootPermissions(trx)

    // ADMIN - All except permission management
    await this.assignAdminPermissions(trx)

    // USER - Basic permissions
    await this.assignUserPermissions(trx)

    // GUEST - Read only
    await this.assignGuestPermissions(trx)
  }

  private async assignRootPermissions(trx?: TransactionClientContract): Promise<void> {
    const rootRole = await Role.findBy('slug', IRole.Slugs.ROOT, { client: trx })
    if (rootRole) {
      const allPermissions = await Permission.query({ client: trx }).select('id')
      await this.syncRolePermissionsService.handle(
        rootRole.id,
        allPermissions.map((p) => p.id),
        trx
      )
    }
  }

  private async assignAdminPermissions(trx?: TransactionClientContract): Promise<void> {
    const adminRole = await Role.findBy('slug', IRole.Slugs.ADMIN, { client: trx })
    if (adminRole) {
      const adminPermissions = await Permission.query({ client: trx })
        .whereNot('resource', IPermission.Resources.PERMISSIONS)
        .orWhere((query) => {
          query
            .where('resource', IPermission.Resources.PERMISSIONS)
            .whereIn('action', [IPermission.Actions.READ, IPermission.Actions.LIST])
        })
        .select('id')

      await this.syncRolePermissionsService.handle(
        adminRole.id,
        adminPermissions.map((p) => p.id),
        trx
      )
    }
  }

  private async assignUserPermissions(trx?: TransactionClientContract): Promise<void> {
    const userRole = await Role.findBy('slug', IRole.Slugs.USER, { client: trx })
    if (userRole) {
      const userPermissions = await Permission.query({ client: trx })
        .where((query) => {
          query
            .where('resource', IPermission.Resources.USERS)
            .whereIn('action', [IPermission.Actions.READ, IPermission.Actions.UPDATE])
        })
        .orWhere((query) => {
          query
            .where('resource', IPermission.Resources.FILES)
            .whereIn('action', [
              IPermission.Actions.CREATE,
              IPermission.Actions.READ,
              IPermission.Actions.LIST,
            ])
        })
        .select('id')

      await this.syncRolePermissionsService.handle(
        userRole.id,
        userPermissions.map((p) => p.id),
        trx
      )
    }
  }

  private async assignGuestPermissions(trx?: TransactionClientContract): Promise<void> {
    const guestRole = await Role.findBy('slug', IRole.Slugs.GUEST, { client: trx })
    if (guestRole) {
      const guestPermissions = await Permission.query({ client: trx })
        .whereIn('action', [IPermission.Actions.READ, IPermission.Actions.LIST])
        .whereNotIn('resource', [IPermission.Resources.PERMISSIONS, IPermission.Resources.AUDIT])
        .select('id')

      await this.syncRolePermissionsService.handle(
        guestRole.id,
        guestPermissions.map((p) => p.id),
        trx
      )
    }
  }
}
