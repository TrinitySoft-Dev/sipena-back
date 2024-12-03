import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateRulesWorkerDto } from './dto/create-rules_worker.dto'
import { UpdateRulesWorkerDto } from './dto/update-rules_worker.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { RulesWorker } from './entities/rules_worker.entity'
import { Repository } from 'typeorm'
import { ContainerDto } from '@/timesheet/dto/create-timesheet.dto'
import { ConditionsService } from '@/conditions/conditions.service'
import { DateTime } from 'luxon'
import { WorkService } from '@/work/work.service'
import { ContainerSizeService } from '@/container_size/container_size.service'

@Injectable()
export class RulesWorkersService {
  constructor(
    @InjectRepository(RulesWorker) private readonly rulesWorkerRepository: Repository<RulesWorker>,
    private readonly conditionSerce: ConditionsService,
    private readonly workService: WorkService,
    private readonly containerSizeService: ContainerSizeService,
  ) {}

  create(createRulesWorkerDto: CreateRulesWorkerDto) {
    const obj: any = createRulesWorkerDto
    obj.container_size = { id: obj.container_size }
    return this.rulesWorkerRepository.save(obj)
  }

  async validateRules(container: ContainerDto, work: string, workers: any[]) {
    const rules = await this.rulesWorkerRepository
      .createQueryBuilder('rules_worker')
      .leftJoinAndSelect('rules_worker.work', 'work')
      .leftJoinAndSelect('rules_worker.condition_groups', 'condition_groups')
      .leftJoinAndSelect('condition_groups.conditions', 'conditions')
      .where('work.id = :work', { work })
      .where('rules_worker.active = :active', { active: true })
      .getMany()

    for (const rule of rules) {
      const conditionGroups = rule.condition_groups
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
        return this.calculateOverUnitsOverLimit(rule, container, rule.payment_type, workers)
      }
    }
  }

  findById(id: number) {
    return this.rulesWorkerRepository.findOne({
      where: { id },
      relations: ['condition_groups', 'condition_groups.conditions', 'container_size', 'work'],
    })
  }

  find() {
    return this.rulesWorkerRepository.find({ relations: ['container_size'] })
  }

  async update(id: number, updateRuleDto: UpdateRulesWorkerDto) {
    try {
      const { condition_groups, work, container_size, ...rest } = updateRuleDto
      const rule = await this.rulesWorkerRepository.findOne({
        where: { id },
        relations: ['condition_groups', 'condition_groups.conditions'],
      })

      if (!rule) {
        throw new NotFoundException('Regla no encontrada')
      }

      Object.assign(rule, rest)

      if (work) rule.work = await this.workService.findById(work)
      if (container_size) rule.container_size = await this.containerSizeService.findById(container_size)

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
              conditionGroup = this.rulesWorkerRepository.manager.create('ConditionGroup', cgDto)
              rule.condition_groups.push(conditionGroup)
            }
          } else {
            conditionGroup = this.rulesWorkerRepository.manager.create('ConditionGroup', cgDto)
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
                  condition = this.rulesWorkerRepository.manager.create('Condition', condDto)
                  conditionGroup.conditions.push(condition)
                }
              } else {
                condition = this.rulesWorkerRepository.manager.create('Condition', condDto)
                conditionGroup.conditions.push(condition)
              }
            }
          }
        }
      }

      await this.rulesWorkerRepository.save(rule)

      return { message: 'Regla actualizada exitosamente' }
    } catch (error) {
      throw error
    }
  }

  private calculateOverUnitsOverLimit(
    rule: RulesWorker,
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
        worker.pay = payPerWorker
      })
    }

    if (payment_type === 'per_person') {
      workers.forEach(worker => {
        worker.pay = calculatePay(rule.rate_type, rule.rate)
      })
    }

    return workers
  }
}
