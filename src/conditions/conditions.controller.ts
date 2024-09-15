import { Controller, Post, Body } from '@nestjs/common'
import { ConditionsService } from './conditions.service'
import { CreateConditionDto } from './dto/create-condition.dto'

@Controller('conditions')
export class ConditionsController {
  constructor(private readonly conditionsService: ConditionsService) {}

  @Post()
  create(@Body() createConditionDto: CreateConditionDto) {
    return this.conditionsService.create(createConditionDto)
  }
}
