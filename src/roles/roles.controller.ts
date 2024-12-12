import {
  Controller,
  Get,
  Post,
  Body,
  DefaultValuePipe,
  Query,
  ParseIntPipe,
  ParseBoolPipe,
  Put,
  Param,
} from '@nestjs/common'
import { RolesService } from './roles.service'
import { CreateRoleDto } from './dto/create-role.dto'
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto)
  }

  @ApiOperation({
    summary: 'Get Roles',
    description: 'This method get all roles',
  })
  @Get()
  @ApiQuery({
    name: 'roleName',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'includePagination',
    required: false,
    type: Boolean,
  })
  findAll(
    @Query('roleName') roleName: string,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page?: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize?: number,
    @Query('includePagination', new DefaultValuePipe(false), ParseBoolPipe) includePagination?: boolean,
  ) {
    return this.rolesService.find({ roleName, page, pageSize, includePagination })
  }

  @Put(':id')
  update(@Body() updateRoleDto: CreateRoleDto, @Param('id') id: string) {
    return this.rolesService.update(id, updateRoleDto)
  }
}
