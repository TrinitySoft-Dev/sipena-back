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
} from '@nestjs/common'
import { TimesheetService } from './timesheet.service'
import { CreateTimesheetDto } from './dto/create-timesheet.dto'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
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

  @Get('/customer/:customerId')
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
  findByCustomer(
    @Param('customerId') customerId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize?: number,
  ) {
    return this.timesheetService.findByCustomer(customerId, page, pageSize)
  }

  @Get('/worker/:workerId')
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
}
