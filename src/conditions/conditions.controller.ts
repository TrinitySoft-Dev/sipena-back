import { Controller, Post, Body } from '@nestjs/common'
import { ConditionsService } from './conditions.service'
import { CreateConditionDto } from './dto/create-condition.dto'
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger'

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
