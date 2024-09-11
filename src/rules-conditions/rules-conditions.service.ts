import { Injectable } from '@nestjs/common'
import { CreateRulesConditionDto } from './dto/create-rules-condition.dto'
import { UpdateRulesConditionDto } from './dto/update-rules-condition.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { RulesCondition } from './entities/rules-condition.entity'
import { Repository } from 'typeorm'

@Injectable()
export class RulesConditionsService {
  constructor(
    @InjectRepository(RulesCondition) private readonly rulesConditionRepository: Repository<RulesCondition>,
  ) {}

  async create(createRulesConditionDto: CreateRulesConditionDto) {
    return await this.rulesConditionRepository.save(createRulesConditionDto)
  }

  async createBatch(createRulesConditionDto: CreateRulesConditionDto[]) {
    const rulesConditions = []
    createRulesConditionDto.forEach(async item => {
      console.log(item)
      const rule = await this.rulesConditionRepository.save(item)
      rulesConditions.push(rule)
    })
    return createRulesConditionDto
  }
}
