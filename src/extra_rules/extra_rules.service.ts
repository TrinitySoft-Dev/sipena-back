import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateExtraRuleDto } from './dto/create-extra_rule.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { ExtraRule } from './entities/extra_rule.entity'
import { ILike, Repository } from 'typeorm'
import { UpdateExtraRuleDto } from './dto/update-extra_rule.dto'

@Injectable()
export class ExtraRulesService {
  constructor(@InjectRepository(ExtraRule) private readonly extraRuleRepository: Repository<ExtraRule>) {}

  async create(createExtraRuleDto: CreateExtraRuleDto) {
    return await this.extraRuleRepository.save(createExtraRuleDto)
  }

  async findAll({
    page,
    pageSize,
    includePagination,
    name,
    rate,
  }: {
    page: number
    pageSize: number
    includePagination: boolean
    name: string
    rate: number
  }) {
    const whereConditions: any = { active: true }

    if (name) {
      whereConditions.name = ILike(`%${name}%`)
    }
    if (rate) {
      whereConditions.rate = rate
    }

    if (includePagination) {
      const [result, total] = await this.extraRuleRepository.findAndCount({
        skip: page * pageSize,
        where: whereConditions,
        take: pageSize,
        order: {
          created_at: 'DESC',
        },
      })

      return { result, pagination: { page, pageSize, total } }
    }

    return await this.extraRuleRepository.find({
      order: {
        created_at: 'DESC',
      },
    })
  }

  async findByRuleId(id: number) {
    return await this.extraRuleRepository.find({ where: { rules: { id } } })
  }

  async findById(id: number) {
    return await this.extraRuleRepository.findOne({
      where: { id },
      relations: ['condition_groups', 'condition_groups.conditions'],
    })
  }

  async delete(id: number) {
    return await this.extraRuleRepository.softDelete(id)
  }

  async update(id: number, updateExtraRuleDto: UpdateExtraRuleDto) {
    try {
      const { condition_groups, ...rest } = updateExtraRuleDto
      const rule = await this.extraRuleRepository.findOne({
        where: { id },
        relations: ['condition_groups', 'condition_groups.conditions'],
      })

      if (!rule) {
        throw new NotFoundException('Regla no encontrada')
      }

      Object.assign(rule, rest)

      if (condition_groups) {
        const incomingConditionGroupIds = condition_groups.map(cg => cg.id).filter(id => id)
        const conditionGroupsToRemove = rule.condition_groups.filter(cg => !incomingConditionGroupIds.includes(cg.id))

        if (conditionGroupsToRemove.length > 0) {
          rule.condition_groups = rule.condition_groups.filter(cg => incomingConditionGroupIds.includes(cg.id))
        }

        for (const cgDto of condition_groups) {
          let conditionGroup
          if (cgDto.id) {
            conditionGroup = rule.condition_groups.find(cg => cg.id === cgDto.id)
            if (conditionGroup) {
              Object.assign(conditionGroup, cgDto)
            } else {
              conditionGroup = this.extraRuleRepository.manager.create('ConditionGroup', cgDto)
              rule.condition_groups.push(conditionGroup)
            }
          } else {
            conditionGroup = this.extraRuleRepository.manager.create('ConditionGroup', cgDto)
            rule.condition_groups.push(conditionGroup)
          }

          if (cgDto.conditions) {
            const incomingConditionIds = cgDto.conditions.map(cond => cond.id).filter(id => id)

            const conditionsToRemove = conditionGroup.conditions.filter(cond => !incomingConditionIds.includes(cond.id))

            if (conditionsToRemove.length > 0) {
              conditionGroup.conditions = conditionGroup.conditions.filter(cond =>
                incomingConditionIds.includes(cond.id),
              )
            }

            for (const condDto of cgDto.conditions) {
              let condition
              if (condDto.id) {
                condition = conditionGroup.conditions.find(cond => cond.id === condDto.id)
                if (condition) {
                  Object.assign(condition, condDto)
                } else {
                  condition = this.extraRuleRepository.manager.create('Condition', condDto)
                  conditionGroup.conditions.push(condition)
                }
              } else {
                condition = this.extraRuleRepository.manager.create('Condition', condDto)
                conditionGroup.conditions.push(condition)
              }
            }
          }
        }
      }

      await this.extraRuleRepository.save(rule)

      return { message: 'Regla actualizada exitosamente' }
    } catch (error) {
      throw error
    }
  }
}
