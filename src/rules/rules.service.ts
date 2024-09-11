import { Injectable } from '@nestjs/common'
import { CreateRuleDto } from './dto/create-rule.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Rule } from './entities/rule.entity'
import { Repository } from 'typeorm'
import { RulesConditionsService } from '@/rules-conditions/rules-conditions.service'

@Injectable()
export class RulesService {
  constructor(
    @InjectRepository(Rule) private readonly ruleRepository: Repository<Rule>,
    private readonly rulesConditionsService: RulesConditionsService,
  ) {}

  async create(createRuleDto: CreateRuleDto) {
    const { conditions, ...rest } = createRuleDto

    const rulesConditions = await this.rulesConditionsService.createBatch(conditions)
    console.log(rulesConditions)
  }
}
