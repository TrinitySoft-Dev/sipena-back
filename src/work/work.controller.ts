import { Controller, Post, Body } from '@nestjs/common'
import { WorkService } from './work.service'
import { CreateWorkDto } from './dto/create-work.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Work')
@Controller('work')
export class WorkController {
  constructor(private readonly workService: WorkService) {}

  @Post()
  create(@Body() createWorkDto: CreateWorkDto) {
    return this.workService.create(createWorkDto)
  }
}
