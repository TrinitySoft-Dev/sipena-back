import { Controller, Post, Body, Get, Query, DefaultValuePipe, ParseIntPipe, Param, Put } from '@nestjs/common'
import { ExtraRulesWorkersService } from './extra_rules_workers.service'
import { CreateExtraRulesWorkerDto } from './dto/create-extra_rules_worker.dto'
import { ApiTags } from '@nestjs/swagger'
import { UpdateExtraRulesWorkerDto } from './dto/update-extra_rules_worker.dto'

@ApiTags('Extra rules workers')
@Controller('extra-rules-workers')
export class ExtraRulesWorkersController {
  constructor(private readonly extraRulesWorkersService: ExtraRulesWorkersService) {}

  @Post()
  create(@Body() createExtraRulesWorkerDto: CreateExtraRulesWorkerDto) {
    return this.extraRulesWorkersService.create(createExtraRulesWorkerDto)
  }

  @Get('')
  findAll(
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page?: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize?: number,
  ) {
    return this.extraRulesWorkersService.findAll({ page, pageSize })
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.extraRulesWorkersService.findById(id)
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateExtraRulesWorkerDto: UpdateExtraRulesWorkerDto) {
    return this.extraRulesWorkersService.update(id, updateExtraRulesWorkerDto)
  }
}
