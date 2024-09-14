import { Injectable } from '@nestjs/common'
import { CreateRulesConditionDto } from './dto/create-rules-condition.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { RulesCondition } from './entities/rules-condition.entity'
import { Repository } from 'typeorm'
import { Rule } from '@/rules/entities/rule.entity'

@Injectable()
export class RulesConditionsService {
  constructor(
    @InjectRepository(RulesCondition) private readonly rulesConditionRepository: Repository<RulesCondition>,
  ) {}

  async create(createRulesConditionDto: CreateRulesConditionDto) {
    return await this.rulesConditionRepository.save(createRulesConditionDto as any)
  }

  async createBatch(createRulesConditionDto: CreateRulesConditionDto[], rule: Rule) {
    const rulesConditions = []
    for (const item of createRulesConditionDto) {
      for (const condition of item.list) {
        const conditionEntity = this.rulesConditionRepository.create({
          ...condition,
          rule,
        })
        const savedCondition = await this.rulesConditionRepository.save(conditionEntity)
        rulesConditions.push(savedCondition)
      }
    }
    return rulesConditions
  }
}
