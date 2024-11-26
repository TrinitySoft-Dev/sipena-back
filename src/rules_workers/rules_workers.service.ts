import { Injectable } from '@nestjs/common'
import { CreateRulesWorkerDto } from './dto/create-rules_worker.dto'
import { UpdateRulesWorkerDto } from './dto/update-rules_worker.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { RulesWorker } from './entities/rules_worker.entity'
import { Repository } from 'typeorm'
import { ContainerDto } from '@/timesheet/dto/create-timesheet.dto'
import { ConditionsService } from '@/conditions/conditions.service'
import { DateTime } from 'luxon'

@Injectable()
export class RulesWorkersService {
  constructor(
    @InjectRepository(RulesWorker) private readonly rulesWorkerRepository: Repository<RulesWorker>,
    private readonly conditionSerce: ConditionsService,
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
        this.calculateOverUnitsOverLimit(rule, container, rule.payment_type, workers)
        break
      }
    }
  }

  private calculateOverUnitsOverLimit(
    rule: RulesWorker,
    container: ContainerDto,
    payment_type: string,
    workers: any[],
  ) {
    const start = DateTime.fromISO(container.start.toISOString())
    const end = DateTime.fromISO(container.finish.toISOString())

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
  }
}
