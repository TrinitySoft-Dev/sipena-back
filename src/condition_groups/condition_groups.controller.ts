import { Controller, Post, Body, UseGuards } from '@nestjs/common'
import { ConditionGroupsService } from './condition_groups.service'
import { CreateConditionGroupDto } from './dto/create-condition_group.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@/common/guards/auth.guard'

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('ConditionGroups')
@Controller('condition-groups')
export class ConditionGroupsController {
  constructor(private readonly conditionGroupsService: ConditionGroupsService) {}
}
