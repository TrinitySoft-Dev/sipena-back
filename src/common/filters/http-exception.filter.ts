import { ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common'
import { Request, Response } from 'express'

export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    let status = 500
    let error: any = ''

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      error = exception.getResponse()
    } else {
      error = exception.message
    }

    response.status(status).json({
      status: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error,
    })
  }
}
