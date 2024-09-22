import { Injectable } from '@nestjs/common'
import { CreateRuleDto } from './dto/create-rule.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Rule } from './entities/rule.entity'
import { In, Repository } from 'typeorm'
import { ConditionGroupsService } from '@/condition_groups/condition_groups.service'
import { getAllowedConditionFields } from '@/common/decorators/allowed-fields.decorator'
import * as crypto from 'crypto'
import { WorkService } from '@/work/work.service'

@Injectable()
export class RulesService {
  constructor(
    @InjectRepository(Rule) private readonly ruleRepository: Repository<Rule>,
    private readonly conditionGroupService: ConditionGroupsService,
    private readonly workService: WorkService,
  ) {}

  async create(createRuleDto: CreateRuleDto) {
    try {
      const { customer_id, condition_groups, work_id, ...rest } = createRuleDto

      return await this.ruleRepository.manager.transaction(async transactionalEntityManager => {
        const ruleRepository = transactionalEntityManager.getRepository(Rule)
        const rule = ruleRepository.create({ ...rest })
        await ruleRepository.save(rule)

        const conditions = []

        for (const groupDto of condition_groups) {
          const conditionGroup = await this.conditionGroupService.create(groupDto, rule, transactionalEntityManager)
          conditions.push(conditionGroup)
        }

        rule.condition_groups = conditions
        rule.work = await this.workService.findById(work_id)

        await ruleRepository.save(rule)

        return { message: 'Rule created successfully' }
      })
    } catch (error) {
      throw error
    }
  }

  async findById(id: number | number[]): Promise<Rule[]> {
    return await this.ruleRepository.find({ where: { id: In(Array.isArray(id) ? id : [id]) } })
  }

  async allowedFields() {
    const fields = getAllowedConditionFields()
    return fields.map(field => ({
      field,
      id: crypto.randomUUID(),
    }))
  }
}
