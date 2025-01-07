import { Controller, Post, Body, Param, ParseIntPipe, Get, Query, DefaultValuePipe, Delete } from '@nestjs/common'
import { NormalScheduleService } from './normal_schedule.service'
import { CreateNormalScheduleDto } from './dto/create-normal_schedule.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Normal schedule')
@Controller('normal-schedule')
export class NormalScheduleController {
  constructor(private readonly normalScheduleService: NormalScheduleService) {}

  @Post()
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

  @Get('/select')
  selectAll() {
    return this.normalScheduleService.selectAll()
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.normalScheduleService.findOne(id)
  }

  @Get('customer/:customerId')
  findByCustomer(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Query('page', ParseIntPipe, new DefaultValuePipe(0)) page: number,
    @Query('pageSize', ParseIntPipe, new DefaultValuePipe(10)) pageSize: number,
  ) {
    return this.normalScheduleService.findByCustomer(customerId, { page, pageSize })
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.normalScheduleService.remove(id)
  }
}
