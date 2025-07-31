import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new ValidationException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class ValidationException extends Exception {
  static status = 422
  static code = 'E_VALIDATION_FAILURE'

  constructor(message: string, status: number = 422, code: string = 'E_VALIDATION_FAILURE') {
    super(message, {
      status,
      code,
    })
  }

  async handle(error: this, ctx: HttpContext) {
    ctx.response.status(error.status).send({
      error: {
        message: error.message,
        code: error.code,
      },
    })
  }
}
