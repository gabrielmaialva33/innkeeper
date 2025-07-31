import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import db from '@adonisjs/lucid/services/db'
import logger from '@adonisjs/core/services/logger'

export default class TenantContextMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn) {
    try {
      // Check if the user is authenticated
      if (!auth.user) {
        return await next()
      }

      // Get organization ID from an authenticated user
      const organizationId = auth.user.organization_id

      if (!organizationId) {
        // User is not associated with any organization
        // This might be valid for super admins or during initial setup
        logger.debug('User has no organization_id, skipping tenant context')
        return await next()
      }

      // Set the organization context for PostgreSQL RLS
      // This will be used by all subsequent queries in this request
      await db.rawQuery('SELECT set_current_organization(?)', [organizationId])

      logger.debug(`Tenant context set for organization: ${organizationId}`)

      // Continue with the request
      const output = await next()

      // Clean up after request (optional, as connection will be returned to pool)
      // await db.rawQuery('RESET app.current_organization')

      return output
    } catch (error) {
      logger.error('Error in TenantContextMiddleware:', error)

      // Return error response
      return response.status(500).json({
        error: 'Internal server error',
        message: 'Failed to set tenant context',
      })
    }
  }
}
