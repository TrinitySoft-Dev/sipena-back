import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common'
import { GroupPermissionsService } from './group_permissions.service'
import { CreateGroupPermissionDto } from './dto/create-group_permission.dto'
import { UpdateGroupPermissionDto } from './dto/update-group_permission.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Group permissions')
@Controller('group-permissions')
export class GroupPermissionsController {
  constructor(private readonly groupPermissionsService: GroupPermissionsService) {}

  @Post()
  create(@Body() createGroupPermissionDto: CreateGroupPermissionDto) {
    return this.groupPermissionsService.create(createGroupPermissionDto)
  }

  @Get()
  find() {
    return this.groupPermissionsService.find()
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateGroupPermissionDto: UpdateGroupPermissionDto) {
    return this.groupPermissionsService.update(id, updateGroupPermissionDto)
  }
}
