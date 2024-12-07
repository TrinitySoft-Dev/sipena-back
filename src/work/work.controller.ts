import { Controller, Post, Body, Get, UseGuards, Param, Put } from '@nestjs/common'
import { WorkService } from './work.service'
import { CreateWorkDto } from './dto/create-work.dto'
import { ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@/common/guards/auth.guard'
import { UpdateWorkDto } from './dto/update-work.dto'

@ApiTags('Work')
// @UseGuards(AuthGuard)
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

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.workService.findById(id)
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateWorkDto: UpdateWorkDto) {
    return this.workService.update(id, updateWorkDto)
  }
}
