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
import { ExtraRulesWorkersService } from '@/extra_rules_workers/extra_rules_workers.service'
import { ExtraRulesWorker } from '@/extra_rules_workers/entities/extra_rules_worker.entity'

@Injectable()
export class RulesWorkersService {
  constructor(
    @InjectRepository(RulesWorker) private readonly rulesWorkerRepository: Repository<RulesWorker>,
    private readonly conditionSerce: ConditionsService,
    private readonly workService: WorkService,
    private readonly containerSizeService: ContainerSizeService,
    private readonly extraRulesWorkersService: ExtraRulesWorkersService,
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
      .leftJoinAndSelect('rules_worker.extra_rules_worker', 'extra_rules_worker')
      .leftJoinAndSelect('extra_rules_worker.condition_groups', 'extra_condition_groups')
      .leftJoinAndSelect('extra_condition_groups.conditions', 'extra_conditions')
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
            const extraRules: ExtraRulesWorker[] = rule.extra_rules_worker
            const validateExtraRules = await this.extraRulesWorkersService.validateExtraRules(
              extraRules,
              container,
              workers,
            )
            if (!validateExtraRules || !extraRules.length) {
              groupIsValid = false
              break
            }
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

  async find({ page, pageSize, includePagination }: { page: number; pageSize: number; includePagination: boolean }) {
    if (includePagination) {
      const [result, total] = await this.rulesWorkerRepository.findAndCount({
        skip: page * pageSize,

        take: pageSize,
        relations: ['container_size'],
        order: {
          created_at: 'DESC',
        },
      })

      return { result, pagination: { page, pageSize, total } }
    }

    return await this.rulesWorkerRepository.find({
      relations: ['container_size'],
      order: {
        created_at: 'DESC',
      },
    })
  }

  async update(id: number, updateRuleDto: UpdateRulesWorkerDto) {
    try {
      const { work, container_size, ...rest } = updateRuleDto
      const rule = await this.rulesWorkerRepository.findOne({
        where: { id },
        relations: ['condition_groups', 'condition_groups.conditions'],
      })

      if (!rule) {
        throw new NotFoundException('Regla no encontrada')
      }

      if (work) rule.work = await this.workService.findById(work)
      if (container_size) rule.container_size = await this.containerSizeService.findById(container_size)

      Object.assign(rule, rest)

      await this.rulesWorkerRepository.save(rule)

      return { message: 'Regla actualizada exitosamente' }
    } catch (error) {
      throw error
    }
  }

  async delete(id: number) {
    return await this.rulesWorkerRepository.softDelete(id)
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
