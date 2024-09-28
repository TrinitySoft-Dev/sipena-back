import { Controller, Post, Body, UseGuards, Get, Req, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common'
import { RulesService } from './rules.service'
import { CreateRuleDto } from './dto/create-rule.dto'
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@/common/guards/auth.guard'

@ApiTags('Rules')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('rules')
export class RulesController {
  constructor(private readonly rulesService: RulesService) {}

  @Post()
  async create(@Body() createRuleDto: CreateRuleDto) {
    return await this.rulesService.create(createRuleDto)
  }

  @Get('find')
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
  })
  async find(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize?: number,
  ) {
    return await this.rulesService.find({ page, pageSize })
  }

  @Get('fields')
  async allowedFields() {
    return await this.rulesService.allowedFields()
  }
}
