import { DateTime } from 'luxon'
import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateRuleDto } from './dto/create-rule.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Rule } from './entities/rule.entity'
import { In, Repository } from 'typeorm'
import { getAllowedConditionFields } from '@/common/decorators/allowed-fields.decorator'
import { UpdateRuleDto } from './dto/update-rule.dto'
import { ConditionGroupsService } from '@/condition_groups/condition_groups.service'

@Injectable()
export class RulesService {
  constructor(
    @InjectRepository(Rule) private readonly ruleRepository: Repository<Rule>,
    private readonly conditionGroupsService: ConditionGroupsService,
  ) {}

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
    return await this.ruleRepository.find({
      where: { id: In(Array.isArray(id) ? id : [id]) },
      relations: ['container_size', 'work', 'condition_groups', 'condition_groups.conditions'],
    })
  }

  async update(id: number, updateRuleDto: UpdateRuleDto) {
    const { container_size, condition_groups, work_id, ...rest } = updateRuleDto

    const rule = await this.ruleRepository.findOne({
      where: { id },
      relations: ['condition_groups', 'condition_groups.conditions'],
    })

    if (!rule) throw new NotFoundException('Rule not found')

    Object.assign(rule, rest)

    if (work_id) rule.work = { id: work_id } as any
    if (container_size) rule.container_size = { id: container_size } as any

    const existingConditionGroups = rule.condition_groups || []

    const conditionGroupsIdsFromDto = condition_groups.map(group => group.id).filter(id => id !== undefined)
    const conditionsGroupToDelete = existingConditionGroups.filter(
      group => !conditionGroupsIdsFromDto.includes(group.id),
    )

    for (const group of conditionsGroupToDelete) {
      await this.conditionGroupsService.remove(group.id)
    }

    for (const groupDto of condition_groups) {
      if (groupDto.id) {
        await this.conditionGroupsService.update(groupDto.id, groupDto)
      } else {
        await this.conditionGroupsService.create(groupDto, rule)
      }
    }

    // return await this.ruleRepository.update(id, {
    //   ...rest,
    //   container_size: { id: container_size },
    // })
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
