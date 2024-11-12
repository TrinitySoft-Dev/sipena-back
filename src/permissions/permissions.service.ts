import { Injectable } from '@nestjs/common'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Permission } from './entities/permission.entity'
import { Repository } from 'typeorm'

@Injectable()
export class PermissionsService {
  constructor(@InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>) {}

  create(createPermissionDto: CreatePermissionDto) {
    return this.permissionRepository.save(createPermissionDto)
  }
}
