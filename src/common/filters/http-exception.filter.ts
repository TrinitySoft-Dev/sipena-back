import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Query } from '@nestjs/common'
import { Request, Response } from 'express'
import { TypeORMError } from 'typeorm'
import { GlobalResponseError } from '../exceptions/GlobalResponException'
import { WithSentry } from '@sentry/nestjs'
import * as Sentry from '@sentry/node'
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  @WithSentry()
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    let status: number
    let message: string
    let code: string

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const exceptionResponse = exception.getResponse()
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || exception.message || null
      }
      code = exception.name
    } else if (exception instanceof TypeORMError) {
      status = HttpStatus.UNPROCESSABLE_ENTITY
      message = exception.message
      code = exception.name
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR
      message = exception.message || 'Internal server error'
      code = exception.name || 'InternalServerError'
    }

    Sentry.captureException(exception)

    console.error(
      JSON.stringify(
        {
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          method: request.method,
          message: message,
          code: code,
          stack: exception.stack,
          exception,
        },
        null,
        2,
      ),
    )

    response.status(status).json(GlobalResponseError(status, message, code, request))
  }
}
