import { Injectable } from '@nestjs/common'
import { CreateConditionDto } from './dto/create-condition.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Condition } from './entities/condition.entity'
import { EntityManager, Repository } from 'typeorm'
import { ContainerDto } from '@/timesheet/dto/create-timesheet.dto'

@Injectable()
export class ConditionsService {
  constructor(@InjectRepository(Condition) private readonly conditionRepository: Repository<Condition>) {}

  async create(createConditionDto: CreateConditionDto): Promise<Condition> {
    const condition = this.conditionRepository.create(createConditionDto)
    return await this.conditionRepository.save(condition)
  }

  async createMany(createConditionDtos: CreateConditionDto[]): Promise<Condition[]> {
    try {
      const conditions = createConditionDtos.map(dto => this.conditionRepository.create(dto))

      return await this.conditionRepository.save(conditions)
    } catch (error) {
      throw error
    }
  }

  evalutedConditions(condition: Condition, container: ContainerDto) {
    const fieldName = condition.field
    const operator = condition.operator
    const conditionValue = condition.value

    const fieldValue = container[fieldName]

    if (fieldValue === undefined) {
      throw new Error(`Field ${fieldName} not found`)
    }

    const parseFieldValue = this.parseValue(fieldValue)
    const parseConditionValue = this.parseValue(conditionValue)
    switch (operator) {
      case '=':
        return parseFieldValue === parseConditionValue
      case '>':
        return parseFieldValue > parseConditionValue
      case '<':
        return parseFieldValue < parseConditionValue
      case '>=':
        return parseFieldValue >= parseConditionValue
      case '<=':
        return parseFieldValue <= parseConditionValue
      default:
        throw new Error(`Operator ${operator} not found`)
    }
  }

  async removeByConditionGroupId(id: number) {
    await this.conditionRepository.delete({ condition_group_id: id })
  }

  async countConditionsByConditionGroupId(conditionGroupId: number) {
    return await this.conditionRepository.count({ where: { condition_group_id: conditionGroupId } })
  }

  private parseValue(value: any) {
    if (!isNaN(value)) {
      return Number(value)
    }

    if (value.toLowerCase() === 'true') return true
    if (value.toLowerCase() === 'false') return false

    return value
  }
}
