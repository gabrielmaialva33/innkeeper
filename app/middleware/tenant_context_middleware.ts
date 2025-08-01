import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import db from '@adonisjs/lucid/services/db'
import logger from '@adonisjs/core/services/logger'

export default class TenantContextMiddleware {
  async handle({ auth, request }: HttpContext, next: NextFn) {
    try {
      const url = request.url()

      // Skip tenant context for static assets, auth routes, and system routes
      const skipRoutes = [
        '/login',
        '/register',
        '/auth',
        '/version',
        '/health',
        '/@vite',
        '/inertia',
        '.js',
        '.css',
        '.png',
        '.jpg',
        '.svg',
        '.ico',
        '.woff',
        '.woff2',
        '.ttf',
        '.map',
      ]

      const shouldSkip = url === '/' || skipRoutes.some((route) => url.includes(route))

      if (shouldSkip) {
        return await next()
      }

      // Try to check if user is authenticated
      // Use a try-catch here as auth.user might throw if not authenticated
      let user
      try {
        await auth.check()
        user = auth.user
      } catch {
        // User is not authenticated, continue without tenant context
        return await next()
      }

      // Check if the user is authenticated
      if (!user) {
        return await next()
      }

      // Get organization ID from an authenticated user
      const organizationId = user.organization_id

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

      // Don't block the request on error, just log and continue
      return await next()
    }
  }
}
