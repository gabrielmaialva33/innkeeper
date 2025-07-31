import { inject } from '@adonisjs/core'
import RolesRepository from '#repositories/roles_repository'
import IRole from '#interfaces/role_interface'
import { ModelAttributes } from '@adonisjs/lucid/types/model'
import Role from '#models/role'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'

export const AvailableRoles = [
  { name: 'Root', slug: IRole.Slugs.ROOT },
  { name: 'Admin', slug: IRole.Slugs.ADMIN },
  { name: 'User', slug: IRole.Slugs.USER },
  { name: 'Guest', slug: IRole.Slugs.GUEST },
  { name: 'Editor', slug: IRole.Slugs.EDITOR },
] as ModelAttributes<Role>[]

@inject()
export default class CreateDefaultRolesService {
  constructor(private rolesRepository: RolesRepository) {}

  async run(trx?: TransactionClientContract) {
    for (const role of AvailableRoles) {
      const r = await this.rolesRepository.findBy(
        'slug',
        role.slug,
        trx ? { client: trx } : undefined
      )
      if (!r) await this.rolesRepository.create(role, trx ? { client: trx } : undefined)
    }
  }
}
