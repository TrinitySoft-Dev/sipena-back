import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
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
}
