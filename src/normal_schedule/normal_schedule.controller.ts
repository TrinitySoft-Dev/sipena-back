import { Controller, Post, Body, Param, ParseIntPipe, Get } from '@nestjs/common'
import { NormalScheduleService } from './normal_schedule.service'
import { CreateNormalScheduleDto } from './dto/create-normal_schedule.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Normal schedule')
@Controller('normal-schedule')
export class NormalScheduleController {
  constructor(private readonly normalScheduleService: NormalScheduleService) {}

  @Post(':customerId')
  create(
    @Body() createNormalScheduleDto: CreateNormalScheduleDto,
    @Param('customerId', ParseIntPipe) customerId: number,
  ) {
    return this.normalScheduleService.create(createNormalScheduleDto, customerId)
  }

  @Get(':customerId')
  findByCustomerId(@Param('customerId', ParseIntPipe) customerId: number) {
    return this.normalScheduleService.findByCustomerId(customerId)
  }
}
