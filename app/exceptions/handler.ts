import app from '@adonisjs/core/services/app'
import { ExceptionHandler, HttpContext } from '@adonisjs/core/http'
import type { StatusPageRange, StatusPageRenderer } from '@adonisjs/core/types/http'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * Status pages are used to display a custom HTML pages for certain error
   * codes. You might want to enable them in production only, but feel
   * free to enable them in development as well.
   */
  protected renderStatusPages = app.inProduction

  /**
   * Status pages is a collection of error code range and a callback
   * to return the HTML contents to send as a response.
   */
  protected statusPages: Record<StatusPageRange, StatusPageRenderer> = {
    '404': (error, { inertia }) => inertia.render('errors/not_found', { error }),
    '500..599': (error, { inertia }) => inertia.render('errors/server_error', { error }),
  }

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    /**
     * Handle validation errors from VineJS
     */
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'E_VALIDATION_ERROR'
    ) {
      const validationError = error as any
      if (ctx.request.accepts(['html', 'json']) === 'json') {
        return ctx.response.status(422).json({
          errors: validationError.messages || [],
        })
      }
      ctx.session.flashAll()
      ctx.session.flash('errors', validationError.messages || {})
      return ctx.response.redirect().back()
    }

    /**
     * Handle rate limiting errors
     */
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'E_TOO_MANY_REQUESTS'
    ) {
      const rateLimitError = error as any

      // Set rate limit headers from the response object
      if (rateLimitError.response) {
        ctx.response.header('x-ratelimit-limit', rateLimitError.response.limit)
        ctx.response.header('x-ratelimit-remaining', rateLimitError.response.remaining)
        ctx.response.header('retry-after', rateLimitError.response.availableIn)
      }

      return ctx.response.status(429).json({
        errors: [
          {
            code: 'E_TOO_MANY_REQUESTS',
            message: rateLimitError.message || 'Too many requests',
            status: 429,
          },
        ],
      })
    }

    return super.handle(error, ctx)
  }

  /**
   * The method is used to report error to the logging service or
   * the a third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
