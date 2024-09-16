import { Controller, Post, Body } from '@nestjs/common'
import { ConditionGroupsService } from './condition_groups.service'
import { CreateConditionGroupDto } from './dto/create-condition_group.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('ConditionGroups')
@Controller('condition-groups')
export class ConditionGroupsController {
  constructor(private readonly conditionGroupsService: ConditionGroupsService) {}
}
