import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Query } from '@nestjs/common'
import { Request, Response } from 'express'
import { CannotCreateEntityIdMapError, QueryFailedError } from 'typeorm'
import { GlobalResponseError } from '../exceptions/GlobalResponException'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    let message = (exception as any).message
    let code = 'HttpException'

    let status = HttpStatus.INTERNAL_SERVER_ERROR

    switch (exception.constructor) {
      case HttpException:
        status = (exception as HttpException).getStatus()
        break
      case QueryFailedError:
        status = HttpStatus.UNPROCESSABLE_ENTITY
        message = (exception as QueryFailedError).message
        code = (exception as any).code
        break
      case CannotCreateEntityIdMapError:
        status = HttpStatus.UNPROCESSABLE_ENTITY
        message = (exception as CannotCreateEntityIdMapError).message
        code = (exception as any).code
        break
      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR
    }

    response.status(status).json(GlobalResponseError(status, message, code, request))
  }
}
