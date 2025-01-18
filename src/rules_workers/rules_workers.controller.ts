import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  ParseBoolPipe,
  UseGuards,
} from '@nestjs/common'
import { RulesWorkersService } from './rules_workers.service'
import { CreateRulesWorkerDto } from './dto/create-rules_worker.dto'
import { UpdateRulesWorkerDto } from './dto/update-rules_worker.dto'
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@/common/guards/auth.guard'

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('Rules Workers')
@Controller('rules-workers')
export class RulesWorkersController {
  constructor(private readonly rulesWorkersService: RulesWorkersService) {}

  @Post()
  create(@Body() createRulesWorkerDto: CreateRulesWorkerDto) {
    return this.rulesWorkersService.create(createRulesWorkerDto)
  }

  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'includePagination', required: false, type: Boolean })
  @Get()
  find(
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page?: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize?: number,
    @Query('includePagination', new DefaultValuePipe(false), ParseBoolPipe) includePagination?: boolean,
  ) {
    return this.rulesWorkersService.find({ page, pageSize, includePagination })
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.rulesWorkersService.findById(id)
  }

  @Put('/:id')
  update(@Param('id') id: number, @Body() updateRuleWorkerDto: UpdateRulesWorkerDto) {
    return this.rulesWorkersService.update(id, updateRuleWorkerDto)
  }
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.rulesWorkersService.delete(id)
  }
}
