import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common'
import { ExtraRulesService } from './extra_rules.service'
import { CreateExtraRuleDto } from './dto/create-extra_rule.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
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

  @Get()
  findAll() {
    return this.extraRulesService.findAll()
  }

  @Get(':id')
  findByRuleId(@Param('id') id: number) {
    return this.extraRulesService.findByRuleId(id)
  }
}
