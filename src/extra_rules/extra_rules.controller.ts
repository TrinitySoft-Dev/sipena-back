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
} from '@nestjs/common'
import { ExtraRulesService } from './extra_rules.service'
import { CreateExtraRuleDto } from './dto/create-extra_rule.dto'
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@/common/guards/auth.guard'

@ApiTags('Extra Rules')
@ApiBearerAuth()
@UseGuards(AuthGuard)
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
  @Get()
  @Get('find')
  findAll(
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page?: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize?: number,
    @Query('includePagination', new DefaultValuePipe(false), ParseBoolPipe) includePagination?: boolean,
  ) {
    return this.extraRulesService.findAll({ page, pageSize, includePagination })
  }

  @Get('/rule/:id')
  findByRuleId(@Param('id') id: number) {
    return this.extraRulesService.findByRuleId(id)
  }
}
