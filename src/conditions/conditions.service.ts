import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateConditionDto } from './dto/create-condition.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Condition } from './entities/condition.entity'
import { EntityManager, Repository } from 'typeorm'
import { ContainerDto } from '@/timesheet/dto/create-timesheet.dto'
import { UpdateConditionDto } from './dto/update-condition.dto'

@Injectable()
export class ConditionsService {
  constructor(@InjectRepository(Condition) private readonly conditionRepository: Repository<Condition>) {}

  async create(createConditionDto: CreateConditionDto) {
    const { condition_group_id, ...rest } = createConditionDto

    const condition = this.conditionRepository.create({
      ...rest,
      condition_group: { id: condition_group_id },
    })

    await this.conditionRepository.save(condition)

    return condition
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
        return parseFieldValue == parseConditionValue
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

  async remove(id: number) {
    const condition = await this.conditionRepository.findOne({ where: { id } })
    if (condition) {
      await this.conditionRepository.remove(condition)
    }
  }

  async update(id: number, updateConditionDto: UpdateConditionDto) {
    let condition = await this.conditionRepository.findOne({ where: { id } })
    if (!condition) {
      throw new NotFoundException('Condición no encontrada')
    }

    Object.assign(condition, updateConditionDto)
    condition = await this.conditionRepository.save(condition)
    return condition
  }

  async countConditionsByConditionGroupId(conditionGroupId: number) {
    return await this.conditionRepository.count({ where: { condition_group_id: conditionGroupId } })
  }

  private parseValue(value: any) {
    if (!isNaN(value)) {
      return Number(value)
    }

    if (value.toLowerCase() === 'true' || value.toLowerCase() === 'yes') return true
    if (value.toLowerCase() === 'false' || value.toLowerCase() === 'no') return false

    return value
  }
}
