import { Controller, Get, Post, Body } from '@nestjs/common'
import { WorkFieldsService } from './work_fields.service'
import { CreateWorkFieldDto } from './dto/create-work_field.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Work fields')
@Controller('work-fields')
export class WorkFieldsController {
  constructor(private readonly workFieldsService: WorkFieldsService) {}

  @Post()
  create(@Body() createWorkFieldDto: CreateWorkFieldDto) {
    return this.workFieldsService.create(createWorkFieldDto)
  }

  @Get()
  find() {
    return this.workFieldsService.find()
  }
}
