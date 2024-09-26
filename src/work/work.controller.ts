import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common'
import { WorkService } from './work.service'
import { CreateWorkDto } from './dto/create-work.dto'
import { ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@/common/guards/auth.guard'

@ApiTags('Work')
@UseGuards(AuthGuard)
@Controller('work')
export class WorkController {
  constructor(private readonly workService: WorkService) {}

  @Post()
  create(@Body() createWorkDto: CreateWorkDto) {
    return this.workService.create(createWorkDto)
  }

  @Get()
  find() {
    return this.workService.find()
  }
}
