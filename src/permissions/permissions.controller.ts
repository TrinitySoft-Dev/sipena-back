import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { PermissionsService } from './permissions.service'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { UpdatePermissionDto } from './dto/update-permission.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto)
  }
}
