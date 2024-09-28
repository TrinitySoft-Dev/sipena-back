import { DateTime } from 'luxon'
import { Injectable } from '@nestjs/common'
import { CreateRuleDto } from './dto/create-rule.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Rule } from './entities/rule.entity'
import { In, Repository } from 'typeorm'
import { getAllowedConditionFields } from '@/common/decorators/allowed-fields.decorator'
import { UpdateRuleDto } from './dto/update-rule.dto'

@Injectable()
export class RulesService {
  constructor(@InjectRepository(Rule) private readonly ruleRepository: Repository<Rule>) {}

  async create(createRuleDto: CreateRuleDto) {
    try {
      const { condition_groups, work_id, container_size, ...rest } = createRuleDto

      const rule = this.ruleRepository.create({
        ...rest,
        work: { id: work_id },
        container_size: { id: container_size },
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

  async update(id: number, updateRuleDto: UpdateRuleDto) {
    const { container_size, ...rest } = updateRuleDto
    return await this.ruleRepository.update(id, {
      ...rest,
      container_size: { id: container_size },
    })
  }

  async find({ page, pageSize }: { page: number; pageSize: number }) {
    const [result, total] = await this.ruleRepository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      relations: ['container_size'],
    })
    const newResult = result.map(rule => ({
      ...rule,
      container_size: rule?.container_size?.value,
      date: DateTime.fromJSDate(rule.created_at).toFormat('dd/MM/yyyy'),
      time: DateTime.fromJSDate(rule.created_at).toFormat('HH:mm'),
    }))

    return { result: newResult, pagination: { page, pageSize, total } }
  }

  async allowedFields() {
    return getAllowedConditionFields()
  }
}
