import { Controller, Post, Body, UseGuards, Query, Get, Req } from '@nestjs/common'
import { TimesheetService } from './timesheet.service'
import { CreateTimesheetDto } from './dto/create-timesheet.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@/common/guards/auth.guard'

@ApiTags('Timesheet')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('timesheet')
export class TimesheetController {
  constructor(private readonly timesheetService: TimesheetService) {}

  @Post()
  create(@Body() createTimesheetDto: CreateTimesheetDto) {
    return this.timesheetService.create(createTimesheetDto)
  }

  @Get()
  find(@Req() req: any) {
    return this.timesheetService.find(req?.payload)
  }
}
