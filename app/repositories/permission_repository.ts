import LucidRepository from '#shared/lucid/lucid_repository'
import IPermission from '#interfaces/permission_interface'
import Permission from '#models/permission'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'

export default class PermissionRepository
  extends LucidRepository<typeof Permission>
  implements IPermission.Repository
{
  constructor() {
    super(Permission)
  }

  async findByName(name: string): Promise<Permission | null> {
    return await Permission.findBy('name', name)
  }

  async findByResourceAction(resource: string, action: string): Promise<Permission | null> {
    return await Permission.query().where('resource', resource).where('action', action).first()
  }

  async syncPermissions(
    permissions: IPermission.SyncPermissionData[],
    trx?: TransactionClientContract
  ): Promise<void> {
    for (const permissionData of permissions) {
      await Permission.firstOrCreate(
        {
          resource: permissionData.resource,
          action: permissionData.action,
        },
        {
          name: permissionData.name,
          description: permissionData.description,
        },
        { client: trx }
      )
    }
  }
}
