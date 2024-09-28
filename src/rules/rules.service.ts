import { Injectable } from '@nestjs/common'
import { CreateRuleDto } from './dto/create-rule.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Rule } from './entities/rule.entity'
import { In, Repository } from 'typeorm'
import { getAllowedConditionFields } from '@/common/decorators/allowed-fields.decorator'

@Injectable()
export class RulesService {
  constructor(@InjectRepository(Rule) private readonly ruleRepository: Repository<Rule>) {}

  async create(createRuleDto: CreateRuleDto) {
    try {
      const { condition_groups, work_id, container_size, ...rest } = createRuleDto

      const rule = this.ruleRepository.create({
        ...rest,
        work: { id: work_id },
        condition_groups,
      })

      await this.ruleRepository.save(rule)

      return { message: 'Rule created successfully' }
    } catch (error) {
      throw error
    }
  }

  async findById(id: number | number[]): Promise<Rule[]> {
    return await this.ruleRepository.find({ where: { id: In(Array.isArray(id) ? id : [id]) } })
  }

  async find({ page, pageSize }: { page: number; pageSize: number }) {
    const [result, total] = await this.ruleRepository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
    })

    return { result, pagination: { page, pageSize, total } }
  }

  async allowedFields() {
    return getAllowedConditionFields()
  }
}
