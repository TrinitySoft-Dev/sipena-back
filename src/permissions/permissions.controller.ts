import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common'
import { PermissionsService } from './permissions.service'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { UpdatePermissionDto } from './dto/update-permission.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@/common/guards/auth.guard'

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('Permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto)
  }
}
