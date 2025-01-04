import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateExtraRulesWorkerDto } from './dto/create-extra_rules_worker.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { ExtraRulesWorker } from './entities/extra_rules_worker.entity'
import { Repository } from 'typeorm'
import { ConditionsService } from '@/conditions/conditions.service'
import { ContainerDto } from '@/timesheet/dto/create-timesheet.dto'
import { DateTime } from 'luxon'
import { UpdateExtraRulesWorkerDto } from './dto/update-extra_rules_worker.dto'

@Injectable()
export class ExtraRulesWorkersService {
  constructor(
    @InjectRepository(ExtraRulesWorker) private readonly extraRulesWorkerRepository: Repository<ExtraRulesWorker>,
    private readonly conditionSerce: ConditionsService,
  ) {}

  async create(createExtraRulesWorkerDto: CreateExtraRulesWorkerDto) {
    return await this.extraRulesWorkerRepository.save(createExtraRulesWorkerDto)
  }

  async findById(id: number) {
    return await this.extraRulesWorkerRepository.findOne({
      where: { id },
      relations: ['condition_groups', 'condition_groups.conditions'],
    })
  }

  findExtraRuleWorker(id: number) {
    return this.extraRulesWorkerRepository
      .createQueryBuilder('extra_rules_worker')
      .leftJoinAndSelect('extra_rules_worker.condition_groups', 'condition_groups')
      .leftJoinAndSelect('condition_groups.conditions', 'conditions')
      .leftJoinAndSelect('extra_rules_worker.rule_worker', 'rule_worker')
      .where('rule_worker.id IN (:...id)', { id: [id] })
      .getMany()
  }

  async findAll(options) {
    const { page, pageSize, includePagination } = options

    if (!includePagination) {
      return await this.extraRulesWorkerRepository.find()
    }

    const [result, total] = await this.extraRulesWorkerRepository.findAndCount({
      take: pageSize,
      skip: page * pageSize,
      order: {
        created_at: 'DESC',
      },
    })

    return { result: result, pagination: { page, pageSize, total } }
  }

  async update(id: number, updateRuleDto: UpdateExtraRulesWorkerDto) {
    try {
      const { condition_groups, ...rest } = updateRuleDto
      const rule = await this.extraRulesWorkerRepository.findOne({
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
              conditionGroup = this.extraRulesWorkerRepository.manager.create('ConditionGroup', cgDto)
              rule.condition_groups.push(conditionGroup)
            }
          } else {
            conditionGroup = this.extraRulesWorkerRepository.manager.create('ConditionGroup', cgDto)
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
                  condition = this.extraRulesWorkerRepository.manager.create('Condition', condDto)
                  conditionGroup.conditions.push(condition)
                }
              } else {
                condition = this.extraRulesWorkerRepository.manager.create('Condition', condDto)
                conditionGroup.conditions.push(condition)
              }
            }
          }
        }
      }

      await this.extraRulesWorkerRepository.save(rule)

      return { message: 'Regla actualizada exitosamente' }
    } catch (error) {
      throw error
    }
  }

  async validateExtraRules(extraRules: ExtraRulesWorker[], container: ContainerDto, workers: any) {
    if (!extraRules.length) return false

    for (const extraRule of extraRules) {
      const conditionGroups = extraRule.condition_groups
      let ruleIsValid = false

      for (const conditionGroup of conditionGroups) {
        const conditions = conditionGroup.conditions
        let groupIsValid = true

        for (const condition of conditions) {
          const conditionResult = this.conditionSerce.evalutedConditions(condition, container)
          if (!conditionResult) {
            groupIsValid = false
            break
          }
        }

        if (groupIsValid) {
          ruleIsValid = true
          break
        }
      }

      if (ruleIsValid) {
        return this.calculateOverUnitsOverLimit(extraRule, container, extraRule.payment_type, workers)
      }
    }
  }

  async delete(id: number) {
    return await this.extraRulesWorkerRepository.softDelete(id)
  }

  private calculateOverUnitsOverLimit(
    rule: ExtraRulesWorker,
    container: ContainerDto,
    payment_type: string,
    workers: any[],
  ) {
    const start = DateTime.fromISO(String(container.start))
    const end = DateTime.fromISO(String(container.finish))

    const calculatePay = (rateType: string, rate: number) => {
      const timeUnits = {
        hour: end.diff(start, 'hours').hours,
        day: end.diff(start, 'days').days,
        week: end.diff(start, 'weeks').weeks,
        month: end.diff(start, 'months').months,
      }
      return rateType === 'fixed' ? rate : (timeUnits[rateType] || 0) * rate
    }

    if (payment_type === 'group') {
      const numberOfWorkers = workers.length

      const payPerWorker = calculatePay(rule.rate_type, rule.rate) / numberOfWorkers

      workers.forEach(worker => {
        worker.extra_rules = JSON.stringify({
          name: rule.name,
          rate: payPerWorker,
        })
      })
    }

    if (payment_type === 'per_person') {
      workers.forEach(worker => {
        worker.extra_rules = JSON.stringify({
          name: rule.name,
          rate: calculatePay(rule.rate_type, rule.rate),
        })
      })
    }

    return workers
  }
}
