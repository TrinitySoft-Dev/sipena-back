import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common'
import { RulesService } from './rules.service'
import { CreateRuleDto } from './dto/create-rule.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
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

  @Get('fields')
  async allowedFields() {
    return await this.rulesService.allowedFields()
  }
}
