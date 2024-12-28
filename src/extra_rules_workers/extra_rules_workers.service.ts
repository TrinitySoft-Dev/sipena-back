import { Injectable } from '@nestjs/common'
import { CreateExtraRulesWorkerDto } from './dto/create-extra_rules_worker.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { ExtraRulesWorker } from './entities/extra_rules_worker.entity'
import { Repository } from 'typeorm'
import { ConditionsService } from '@/conditions/conditions.service'
import { ContainerDto } from '@/timesheet/dto/create-timesheet.dto'
import { DateTime } from 'luxon'

@Injectable()
export class ExtraRulesWorkersService {
  constructor(
    @InjectRepository(ExtraRulesWorker) private readonly extraRulesWorkerRepository: Repository<ExtraRulesWorker>,
    private readonly conditionSerce: ConditionsService,
  ) {}

  async create(createExtraRulesWorkerDto: CreateExtraRulesWorkerDto) {
    return await this.extraRulesWorkerRepository.save(createExtraRulesWorkerDto)
  }

  async findAll(options) {
    const { page, pageSize } = options

    const [result, total] = await this.extraRulesWorkerRepository.findAndCount({
      take: pageSize,
      skip: page * pageSize,
      order: {
        created_at: 'DESC',
      },
    })

    return { result: result, pagination: { page, pageSize, total } }
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
