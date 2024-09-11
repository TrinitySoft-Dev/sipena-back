import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { RulesConditionsService } from './rules-conditions.service'
import { CreateRulesConditionDto } from './dto/create-rules-condition.dto'
import { UpdateRulesConditionDto } from './dto/update-rules-condition.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('RulesConditions')
@Controller('rules-conditions')
export class RulesConditionsController {
  constructor(private readonly rulesConditionsService: RulesConditionsService) {}

  @Post()
  create(@Body() createRulesConditionDto: CreateRulesConditionDto) {
    return this.rulesConditionsService.create(createRulesConditionDto)
  }
}
