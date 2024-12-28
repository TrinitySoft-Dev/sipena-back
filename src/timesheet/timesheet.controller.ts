import {
  Controller,
  Post,
  Body,
  UseGuards,
  Query,
  Get,
  Req,
  Param,
  DefaultValuePipe,
  ParseIntPipe,
  Put,
} from '@nestjs/common'
import { TimesheetService } from './timesheet.service'
import { CreateTimesheetDto } from './dto/create-timesheet.dto'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@/common/guards/auth.guard'
import { UpdateTimesheetDto } from './dto/update-timesheet.dto'

@ApiTags('Timesheet')
@ApiBearerAuth()
// @UseGuards(AuthGuard)
@Controller('timesheet')
export class TimesheetController {
  constructor(private readonly timesheetService: TimesheetService) {}

  // ================== INIT POST ==================

  @Post()
  create(@Body() createTimesheetDto: CreateTimesheetDto) {
    return this.timesheetService.create(createTimesheetDto)
  }

  @Post('/close-timesheets-worker')
  closeTimesheets(@Body() timesheetIds: number[], @Query('workerId') workerId: number) {
    return this.timesheetService.closeTimesheetWorker(timesheetIds, workerId)
  }

  // ================== END POST ==================

  // ================== INIT GET ==================

  @Get()
  @ApiOperation({
    summary: 'Find timesheets',
    description: 'This method returns timesheets with pagination',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'The page number to fetch',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'The number of items per page',
  })
  find(
    @Req() req: any,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page?: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize?: number,
  ) {
    return this.timesheetService.find(req?.payload, page, pageSize)
  }

  @Get('/open-by-week-customer')
  findWeek() {
    return this.timesheetService.findWeekByOpenTimesheet()
  }

  @Get('/metrics')
  findMetrics(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.timesheetService.getMetricsTimesheet(startDate, endDate)
  }

  @ApiQuery({ name: 'role', required: false })
  @ApiQuery({ name: 'workerId', required: false })
  @Get('/open-by-week-worker')
  findOpenTimesheet(@Query('role') role?: string, @Query('workerId') workerId?: number) {
    return this.timesheetService.getOpenTimesheetsWorkerByWeek()
  }

  @Get('/week-and-role')
  findByWeekAndRole(@Query('week') week: string, @Query('role') role: string, @Query('id') id: number) {
    return this.timesheetService.findByWeekAndRole(week, role, id)
  }

  @ApiOperation({
    summary: 'Find timesheet by customer',
    description: 'This method returns timesheets with pagination',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'The page number to fetch',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'The number of items per page',
  })
  @Get('/customer/:customerId')
  findByCustomer(
    @Param('customerId') customerId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize?: number,
  ) {
    return this.timesheetService.findByCustomer(customerId, page, pageSize)
  }

  @ApiOperation({
    summary: 'Find timesheets by worker',
    description: 'This method returns timesheets with pagination',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'The page number to fetch',
  })
  @Get('/worker/:workerId')
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'The number of items per page',
  })
  findTimesheetByWorker(
    @Param('workerId') workerId: number,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page?: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize?: number,
  ) {
    return this.timesheetService.findTimesheetByWorker(workerId, page, pageSize)
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.timesheetService.findTimesheetById(id)
  }

  // ================== END GET ==================

  // ================== INIT PUT ==================
  @Put(':id')
  update(@Param('id') id: number, @Body() updateTimesheetDto: UpdateTimesheetDto) {
    return this.timesheetService.update(id, updateTimesheetDto)
  }
}
