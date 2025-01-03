import { Controller, Post, Body, Param, ParseIntPipe, Get, Query, DefaultValuePipe } from '@nestjs/common'
import { NormalScheduleService } from './normal_schedule.service'
import { CreateNormalScheduleDto } from './dto/create-normal_schedule.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Normal schedule')
@Controller('normal-schedule')
export class NormalScheduleController {
  constructor(private readonly normalScheduleService: NormalScheduleService) {}

  @Post(':customerId')
  create(@Body() createNormalScheduleDto: CreateNormalScheduleDto) {
    return this.normalScheduleService.create(createNormalScheduleDto)
  }

  @Get('/')
  findAll(
    @Query('page', ParseIntPipe, new DefaultValuePipe(0)) page: number,
    @Query('pageSize', ParseIntPipe, new DefaultValuePipe(10)) pageSize: number,
  ) {
    return this.normalScheduleService.findAll({ page, pageSize })
  }
}
