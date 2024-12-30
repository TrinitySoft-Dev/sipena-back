import { Injectable } from '@nestjs/common'
import { CreateAdminEmailDto } from './dto/create-admin_email.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { AdminEmail } from './entities/admin_email.entity'
import { Repository } from 'typeorm'

@Injectable()
export class AdminEmailsService {
  constructor(@InjectRepository(AdminEmail) private adminEmailRepository: Repository<AdminEmail>) {}

  create(createAdminEmailDto: CreateAdminEmailDto) {
    return this.adminEmailRepository.save(createAdminEmailDto)
  }

  findAll() {
    return this.adminEmailRepository.find()
  }
}
