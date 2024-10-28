import { DateTime } from 'luxon'
import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateRuleDto } from './dto/create-rule.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Rule } from './entities/rule.entity'
import { In, Repository } from 'typeorm'
import { getAllowedConditionFields } from '@/common/decorators/allowed-fields.decorator'
import { UpdateRuleDto } from './dto/update-rule.dto'
import { ConditionGroupsService } from '@/condition_groups/condition_groups.service'
import { User } from '@/users/entities/user.entity'
import { Work } from '@/work/entities/work.entity'
import { WorkService } from '@/work/work.service'
import { ContainerSizeService } from '@/container_size/container_size.service'

@Injectable()
export class RulesService {
  constructor(
    @InjectRepository(Rule) private readonly ruleRepository: Repository<Rule>,
    private readonly conditionGroupsService: ConditionGroupsService,
    private readonly workService: WorkService,
    private readonly containerSizeService: ContainerSizeService,
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
    try {
      const { condition_groups, work_id, container_size, ...rest } = updateRuleDto

      const rule = await this.ruleRepository.findOne({
        where: { id },
        relations: ['condition_groups', 'condition_groups.conditions'],
      })

      if (!rule) {
        throw new NotFoundException('Regla no encontrada')
      }

      Object.assign(rule, rest)
      if (work_id) rule.work = await this.workService.findById(work_id)
      if (container_size) rule.container_size = await this.containerSizeService.findById(container_size)

      if (condition_groups) {
        const existingGroupIds = rule.condition_groups.map(group => group.id)
        const incomingGroupIds = condition_groups.map(group => group.id).filter(id => id)

        const groupsToDelete = existingGroupIds.filter(id => !incomingGroupIds.includes(id))

        for (const groupId of groupsToDelete) {
          await this.conditionGroupsService.remove(groupId)
        }

        for (const groupDto of condition_groups) {
          if (groupDto.id) {
            await this.conditionGroupsService.update(groupDto.id, groupDto)
          } else {
            await this.conditionGroupsService.create({
              ...groupDto,
              rule_id: rule.id,
            })
          }
        }
      }

      // await this.ruleRepository.save(rule)

      return { message: 'Regla actualizada exitosamente' }
    } catch (error) {
      throw error
    }
  }

  async findSelect() {
    return await this.ruleRepository.find({ where: { active: true } })
  }

  async find({ page, pageSize, includePagination }: { page: number; pageSize: number; includePagination: boolean }) {
    if (includePagination) {
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

    return await this.ruleRepository.find({
      where: { active: true },
      relations: ['container_size'],
      select: {
        id: true,
        rate: true,
        status: true,
        name: true,
        container_size: {
          id: true,
          value: true,
        },
      },
    })
  }

  async findByCustomer(customer: number) {
    return await this.ruleRepository
      .createQueryBuilder('rule')
      .innerJoin('rule.customers', 'customer')
      .innerJoinAndSelect('rule.container_size', 'container_size')
      .where('customer.id = :customerId', { customerId: customer })
      .getMany()
  }

  async allowedFields() {
    return getAllowedConditionFields()
  }
}
