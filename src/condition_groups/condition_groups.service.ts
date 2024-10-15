import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateConditionGroupDto } from './dto/create-condition_group.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { ConditionGroup } from './entities/condition_group.entity'
import { Repository } from 'typeorm'
import { ConditionsService } from '@/conditions/conditions.service'
import { UpdateConditionGroupDto } from './dto/update-condition_group.dto'

@Injectable()
export class ConditionGroupsService {
  constructor(
    @InjectRepository(ConditionGroup) private readonly conditionGroupRepository: Repository<ConditionGroup>,
    private readonly conditionsService: ConditionsService,
  ) {}

  async create(createConditionGroupDto: CreateConditionGroupDto) {
    const { conditions, rule_id } = createConditionGroupDto

    const conditionGroup = this.conditionGroupRepository.create({
      rule: { id: rule_id },
    })

    await this.conditionGroupRepository.save(conditionGroup)

    if (conditions) {
      for (const conditionDto of conditions) {
        await this.conditionsService.create({
          ...conditionDto,
          condition_group_id: conditionGroup.id,
        })
      }
    }

    return conditionGroup
  }

  async update(id: number, updateConditionGroupDto: UpdateConditionGroupDto) {
    const { conditions } = updateConditionGroupDto

    const conditionGroup = await this.conditionGroupRepository.findOne({
      where: { id },
      relations: ['conditions'],
    })

    if (!conditionGroup) {
      throw new NotFoundException('Grupo de condiciones no encontrado')
    }

    if (conditions) {
      const existingConditionIds = conditionGroup.conditions.map(cond => cond.id)
      const incomingConditionIds = conditions.map(cond => cond.id).filter(id => id)

      const conditionsToDelete = existingConditionIds.filter(id => !incomingConditionIds.includes(id))

      for (const conditionId of conditionsToDelete) {
        await this.conditionsService.remove(conditionId)
      }

      for (let conditionDto of conditions) {
        if (conditionDto.id) {
          conditionDto = await this.conditionsService.update(conditionDto.id, conditionDto)
        } else {
          await this.conditionsService.create({
            ...conditionDto,
            condition_group_id: conditionGroup.id,
          })
        }
      }
    }

    if (!conditions || conditions.length === 0) {
      await this.remove(id)
    } else {
      await this.conditionGroupRepository.save(conditionGroup)
    }
  }

  async remove(id: number) {
    const conditionGroup = await this.conditionGroupRepository.findOne({
      where: { id },
      relations: ['conditions'],
    })
    if (conditionGroup) {
      await this.conditionGroupRepository.remove(conditionGroup)
    }
  }
}
