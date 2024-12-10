import { Injectable } from '@nestjs/common'
import { CreateGroupPermissionDto } from './dto/create-group_permission.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { GroupPermission } from './entities/group_permission.entity'
import { Repository } from 'typeorm'

@Injectable()
export class GroupPermissionsService {
  constructor(
    @InjectRepository(GroupPermission) private readonly groupPermissionRepository: Repository<GroupPermission>,
  ) {}

  create(createGroupPermissionDto: CreateGroupPermissionDto) {
    const idPermissions = createGroupPermissionDto.permissions.map(permission => ({ id: permission }))
    return this.groupPermissionRepository.save({
      name: createGroupPermissionDto.name,
      permissions: idPermissions,
    })
  }

  find() {
    return this.groupPermissionRepository.find({
      relations: ['permissions'],
    })
  }
}
