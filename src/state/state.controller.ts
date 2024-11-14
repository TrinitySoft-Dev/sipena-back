import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { StateService } from './state.service'
import { CreateStateDto } from './dto/create-state.dto'
import { UpdateStateDto } from './dto/update-state.dto'
import { ApiTags } from '@nestjs/swagger'

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
