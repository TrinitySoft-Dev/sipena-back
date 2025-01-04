import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Param,
  Put,
  ParseBoolPipe,
  Delete,
} from '@nestjs/common'
import { ExtraRulesWorkersService } from './extra_rules_workers.service'
import { CreateExtraRulesWorkerDto } from './dto/create-extra_rules_worker.dto'
import { ApiQuery, ApiTags } from '@nestjs/swagger'
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
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  @ApiQuery({ name: 'includePagination', required: false })
  findAll(
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page?: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize?: number,
    @Query('includePagination', new DefaultValuePipe(true), ParseBoolPipe) includePagination?: boolean,
  ) {
    return this.extraRulesWorkersService.findAll({ page, pageSize, includePagination })
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.extraRulesWorkersService.findById(id)
  }

  @Get('rule/:ruleId')
  findExtraRuleWorkerByRuleId(@Param('ruleId') ruleId: number) {
    return this.extraRulesWorkersService.findExtraRuleWorker(ruleId)
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateExtraRulesWorkerDto: UpdateExtraRulesWorkerDto) {
    return this.extraRulesWorkersService.update(id, updateExtraRulesWorkerDto)
  }
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.extraRulesWorkersService.delete(id)
  }
}
