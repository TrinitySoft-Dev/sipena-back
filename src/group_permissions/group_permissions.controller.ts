import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common'
import { GroupPermissionsService } from './group_permissions.service'
import { CreateGroupPermissionDto } from './dto/create-group_permission.dto'
import { UpdateGroupPermissionDto } from './dto/update-group_permission.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@/common/guards/auth.guard'

@ApiBearerAuth()
@UseGuards(AuthGuard)
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
