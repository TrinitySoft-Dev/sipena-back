import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { TimesheetWorkersService } from './timesheet_workers.service'
import { CreateTimesheetWorkerDto } from './dto/create-timesheet_worker.dto'
import { UpdateTimesheetWorkerDto } from './dto/update-timesheet_worker.dto'

@Controller('timesheet-workers')
export class TimesheetWorkersController {
  constructor(private readonly timesheetWorkersService: TimesheetWorkersService) {}

  @Post()
  create(@Body() createTimesheetWorkerDto: CreateTimesheetWorkerDto) {
    return this.timesheetWorkersService.create(createTimesheetWorkerDto)
  }
}
