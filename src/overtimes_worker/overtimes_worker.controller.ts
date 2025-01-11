import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common'
import { OvertimesWorkerService } from './overtimes_worker.service'
import { CreateOvertimesWorkerDto } from './dto/create-overtimes_worker.dto'
import { UpdateOvertimesWorkerDto } from './dto/update-overtimes_worker.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('worker overtimes')
@Controller('overtimes-worker')
export class OvertimesWorkerController {
  constructor(private readonly overtimesWorkerService: OvertimesWorkerService) {}

  @Post()
  create(@Body() createOvertimesWorkerDto: CreateOvertimesWorkerDto) {
    return this.overtimesWorkerService.create(createOvertimesWorkerDto)
  }

  @Get('')
  getAll(
    @Query('page', new DefaultValuePipe(0)) page: number,
    @Query('pageSize', new DefaultValuePipe(10)) pageSize: number,
  ) {
    return this.overtimesWorkerService.getAllOvertimes({ page, pageSize })
  }

  @Get('select')
  select() {
    return this.overtimesWorkerService.select()
  }

  @Get(':id')
  getById(@Param('id', new ParseIntPipe()) id: number) {
    return this.overtimesWorkerService.getById(id)
  }

  @Patch(':id')
  update(@Param('id', new ParseIntPipe()) id: number, @Body() updateOvertimesWorkerDto: UpdateOvertimesWorkerDto) {
    return this.overtimesWorkerService.update(id, updateOvertimesWorkerDto)
  }

  @Delete(':id')
  remove(@Param('id', new ParseIntPipe()) id: number) {
    return this.overtimesWorkerService.remove(id)
  }
}
