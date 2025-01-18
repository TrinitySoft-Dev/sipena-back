import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common'
import { WorkFieldsService } from './work_fields.service'
import { CreateWorkFieldDto } from './dto/create-work_field.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@/common/guards/auth.guard'

@ApiTags('Work fields')
@ApiBearerAuth()
@UseGuards(AuthGuard)
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
