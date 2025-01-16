import { Injectable } from '@nestjs/common'
import { CreateGroupPermissionDto } from './dto/create-group_permission.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { GroupPermission } from './entities/group_permission.entity'
import { Repository } from 'typeorm'
import { UpdateGroupPermissionDto } from './dto/update-group_permission.dto'

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

  update(id: string, updateGroupPermissionDto: UpdateGroupPermissionDto) {
    const idPermissions = updateGroupPermissionDto.permissions.map(permission => ({ id: permission }))
    const groupPermission = this.groupPermissionRepository.findOne({ where: { id } })

    const newData = Object.assign(groupPermission, {
      name: updateGroupPermissionDto.name,
      permissions: idPermissions,
    })
    return this.groupPermissionRepository.save(newData)
  }
}
