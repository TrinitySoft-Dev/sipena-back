import { Controller, Post, Body, Get, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common'
import { ExtraRulesWorkersService } from './extra_rules_workers.service'
import { CreateExtraRulesWorkerDto } from './dto/create-extra_rules_worker.dto'
import { ApiTags } from '@nestjs/swagger'

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
}
