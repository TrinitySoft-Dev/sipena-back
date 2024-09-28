import { Injectable } from '@nestjs/common'
import { CreateConditionGroupDto } from './dto/create-condition_group.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { ConditionGroup } from './entities/condition_group.entity'
import { EntityManager, Repository } from 'typeorm'
import { ConditionsService } from '@/conditions/conditions.service'
import { Rule } from '@/rules/entities/rule.entity'

@Injectable()
export class ConditionGroupsService {
  constructor(
    @InjectRepository(ConditionGroup) private readonly conditionGroupRepository: Repository<ConditionGroup>,
    private readonly conditionsService: ConditionsService,
  ) {}

  async create(createConditionGroupDto: CreateConditionGroupDto, rule: Rule) {
    try {
      const { conditions } = createConditionGroupDto

      const conditionGroup = this.conditionGroupRepository.create()
      conditionGroup.rule = rule

      const createdConditions = await this.conditionsService.createMany(conditions)

      conditionGroup.conditions = createdConditions

      return this.conditionGroupRepository.create(conditionGroup)
    } catch (error) {
      throw error
    }
  }
}
