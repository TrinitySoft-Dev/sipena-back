import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common'
import { StateService } from './state.service'
import { CreateStateDto } from './dto/create-state.dto'
import { UpdateStateDto } from './dto/update-state.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@/common/guards/auth.guard'

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('State')
@Controller('state')
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Post()
  create(@Body() createStateDto: CreateStateDto) {
    return this.stateService.create(createStateDto)
  }

  @Get()
  findAll() {
    return this.stateService.findAll()
  }
}
