import { Controller, Post, Body, UseGuards } from '@nestjs/common'
import { ConditionsService } from './conditions.service'
import { CreateConditionDto } from './dto/create-condition.dto'
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@/common/guards/auth.guard'

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('Conditions')
@Controller('conditions')
export class ConditionsController {
  constructor(private readonly conditionsService: ConditionsService) {}

  @ApiExcludeEndpoint()
  @Post()
  create(@Body() createConditionDto: CreateConditionDto) {
    return this.conditionsService.create(createConditionDto)
  }
}
