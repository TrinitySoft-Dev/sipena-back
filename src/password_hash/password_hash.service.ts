import * as crypto from 'crypto'
import { Injectable } from '@nestjs/common'
import { CreatePasswordHashDto } from './dto/create-password_hash.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PasswordHash } from './entities/password_hash.entity'

@Injectable()
export class PasswordHashService {
  constructor(@InjectRepository(PasswordHash) private readonly passwordHashRepository: Repository<PasswordHash>) {}

  create(createPasswordHashDto: CreatePasswordHashDto) {
    const { token } = createPasswordHashDto
    const hashToken = this.hastToken(token)

    return this.passwordHashRepository.save({
      ...createPasswordHashDto,
      token: hashToken,
    })
  }

  async findByHash(hash: string) {
    return await this.passwordHashRepository.findOne({ where: { token: hash } })
  }

  async removeByHash(hash: string) {
    return await this.passwordHashRepository.delete({ token: hash })
  }

  hastToken(password: string) {
    return crypto.createHash('sha256').update(password).digest('hex')
  }
}
