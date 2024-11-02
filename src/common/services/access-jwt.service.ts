import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { config } from '@/common/config/config'

@Injectable()
export class AccessJwtService extends JwtService {
  constructor() {
    super({
      secret: config.JWT_SECRET,
      signOptions: { expiresIn: config.JWT_EXPIRES },
    })
  }
}