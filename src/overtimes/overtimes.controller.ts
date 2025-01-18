import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
  UseGuards,
} from '@nestjs/common'
import { OvertimesService } from './overtimes.service'
import { CreateOvertimeDto } from './dto/create-overtime.dto'
import { UpdateOvertimeDto } from './dto/update-overtime.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@/common/guards/auth.guard'

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('Overtimes')
@Controller('overtimes')
export class OvertimesController {
  constructor(private readonly overtimesService: OvertimesService) {}

  @Get('')
  find(
    @Query('page', new ParseIntPipe(), new DefaultValuePipe(0)) page: number,
    @Query('pageSize', new ParseIntPipe(), new DefaultValuePipe(10)) pageSize: number,
    @Query('name') name?: string,
  ) {
    return this.overtimesService.selectAll({
      page,
      pageSize,
      name,
    })
  }

  @Get('/select')
  select() {
    return this.overtimesService.select()
  }

  @Get(':id')
  findById(@Param('id', new ParseIntPipe()) id: number) {
    return this.overtimesService.findById(id)
  }

  @Get('/normal-schedule/:normalScheduleId')
  findByIdNormalSchedule(@Param('normalScheduleId', new ParseIntPipe()) normalScheduleId: number) {
    return this.overtimesService.findByIdNormalSchedule(normalScheduleId)
  }

  @Post()
  create(@Body() createOvertimeDto: CreateOvertimeDto) {
    return this.overtimesService.create(createOvertimeDto)
  }

  @Put(':id')
  update(@Param('id', new ParseIntPipe()) id: number, @Body() updateOvertimeDto: UpdateOvertimeDto) {
    return this.overtimesService.update(id, updateOvertimeDto)
  }

  @Delete(':id')
  remove(@Param('id', new ParseIntPipe()) id: number) {
    return this.overtimesService.remove(id)
  }
}
