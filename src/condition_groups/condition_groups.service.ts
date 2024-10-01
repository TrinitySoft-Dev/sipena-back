import { Injectable } from '@nestjs/common'
import { CreateConditionGroupDto } from './dto/create-condition_group.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { ConditionGroup } from './entities/condition_group.entity'
import { EntityManager, Repository } from 'typeorm'
import { ConditionsService } from '@/conditions/conditions.service'
import { Rule } from '@/rules/entities/rule.entity'
import { UpdateConditionGroupDto } from './dto/update-condition_group.dto'

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

  async createByRule(createConditionGroupDto: CreateConditionGroupDto, rule: Rule) {
    const { conditions, id } = createConditionGroupDto

    const conditionGroup = this.conditionGroupRepository.create({
      rule: { id },
    })

    await this.conditionGroupRepository.save(conditionGroup)

    // Crear las condiciones asociadas
    for (const conditionDto of conditions) {
      await this.conditionsService.create({
        ...conditionDto,
        condition_group_id: conditionGroup.id,
      })
    }

    return conditionGroup
  }

  async remove(id: number) {
    await this.conditionsService.removeByConditionGroupId(id)
    await this.conditionGroupRepository.delete(id)
  }

  async update(id: number, updateConditionGroupDto: UpdateConditionGroupDto) {}
}
