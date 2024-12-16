import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  ParseBoolPipe,
  Put,
  Delete,
} from '@nestjs/common'
import { ExtraRulesService } from './extra_rules.service'
import { CreateExtraRuleDto } from './dto/create-extra_rule.dto'
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@/common/guards/auth.guard'
import { UpdateExtraRuleDto } from './dto/update-extra_rule.dto'

@ApiTags('Extra Rules')
// @ApiBearerAuth()
// @UseGuards(AuthGuard)
@Controller('extra-rules')
export class ExtraRulesController {
  constructor(private readonly extraRulesService: ExtraRulesService) {}

  @Post()
  create(@Body() createExtraRuleDto: CreateExtraRuleDto) {
    return this.extraRulesService.create(createExtraRuleDto)
  }

  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'includePagination', required: false, type: Boolean })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'rate', required: false, type: Number })
  @Get()
  @Get('find')
  findAll(
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page?: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize?: number,
    @Query('includePagination', new DefaultValuePipe(false), ParseBoolPipe) includePagination?: boolean,
    @Query('rate') rate?: number,
    @Query('name') name?: string,
  ) {
    return this.extraRulesService.findAll({ page, pageSize, includePagination,rate,name })
  }

  @Get('/rule/:id')
  findByRuleId(@Param('id') id: number) {
    return this.extraRulesService.findByRuleId(id)
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.extraRulesService.findById(id)
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateExtraRuleDto: UpdateExtraRuleDto) {
    return this.extraRulesService.update(id, updateExtraRuleDto)
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.extraRulesService.delete(id)
  }
}
