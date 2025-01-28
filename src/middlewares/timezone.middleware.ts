import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { Settings } from 'luxon'

@Injectable()
export class TimezoneMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const timezoneCookie = req.cookies['x-timezone']

    if (timezoneCookie) {
      Settings.defaultZone = timezoneCookie
    } else {
      console.warn('No se encontró la cookie de zona horaria.')
    }

    next()
  }
}
