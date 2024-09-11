import { Controller, Post, Body, UseGuards } from '@nestjs/common'
import { RulesService } from './rules.service'
import { CreateRuleDto } from './dto/create-rule.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@/common/guards/auth.guard'

@ApiTags('Rules')
@ApiBearerAuth()
@Controller('rules')
export class RulesController {
  constructor(private readonly rulesService: RulesService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createRuleDto: CreateRuleDto) {
    return this.rulesService.create(createRuleDto)
  }
}
