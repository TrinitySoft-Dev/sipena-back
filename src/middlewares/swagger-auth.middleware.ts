import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class BasicAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const auth = req.headers.authorization

    if (!auth || auth.indexOf('Basic ') === -1) {
      res.setHeader('WWW-Authenticate', 'Basic')
      throw new UnauthorizedException('No credentials sent')
    }

    const base64Credentials = auth.split(' ')[1]
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
    const [username, password] = credentials.split(':')

    const validUsername = process.env.SWAGGER_USER || 'admin'
    const validPassword = process.env.SWAGGER_PASSWORD || 'admin123'

    if (username !== validUsername || password !== validPassword) {
      throw new UnauthorizedException('Invalid credentials')
    }

    next()
  }
}
