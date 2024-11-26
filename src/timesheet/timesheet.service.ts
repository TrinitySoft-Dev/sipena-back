import { Injectable, NotFoundException } from '@nestjs/common'
import { ContainerDto, CreateTimesheetDto } from './dto/create-timesheet.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Timesheet } from './entities/timesheet.entity'
import { In, Repository } from 'typeorm'
import { ContainerService } from '@/container/container.service'
import { UsersService } from '@/users/users.service'
import { Rule } from '@/rules/entities/rule.entity'
import { ROLES_CONST } from '@/common/conts/roles.const'
import { ConditionsService } from '@/conditions/conditions.service'
import { TimesheetWorkersService } from '@/timesheet_workers/timesheet_workers.service'
import { ExtraRule } from '@/extra_rules/entities/extra_rule.entity'
import { ContainerSizeService } from '@/container_size/container_size.service'
import { RulesWorkersService } from '@/rules_workers/rules_workers.service'

@Injectable()
export class TimesheetService {
  constructor(
    @InjectRepository(Timesheet) private readonly timesheetRepository: Repository<Timesheet>,
    private readonly containerService: ContainerService,
    private readonly usersService: UsersService,
    private readonly conditionsService: ConditionsService,
    private readonly timesheetWorkersService: TimesheetWorkersService,
    private readonly rulesWorkersService: RulesWorkersService,
  ) {}

  async create(createTimesheetDto: CreateTimesheetDto) {
    try {
      const { timesheet, container } = createTimesheetDto
      let { customer_id, workers, work_id, ...restTimesheet } = timesheet

      const customerUser = await this.usersService.findByWorks(customer_id, work_id, container.size)
      if (!customerUser.rules.length) throw new NotFoundException('Rules not found')

      const rules = customerUser.rules
      const rate = await this.validateRules(rules, container)

      const createdContainer = await this.containerService.create({
        ...container,
        product: { id: container.product },
      })

      restTimesheet = {
        day: restTimesheet.day,
        week: restTimesheet.week,
        comment: restTimesheet.comment,
        images: restTimesheet.images,
      }

      const timesheetRes = this.timesheetRepository.create({
        ...restTimesheet,
        rate: typeof rate === 'object' ? rate.rate : 0,
        base: typeof rate === 'object' ? rate.base : 0,
        container: createdContainer,
        customer: { id: customer_id },
        extra_rates: typeof rate === 'object' ? JSON.stringify(rate.json) : null,
      })

      await this.timesheetRepository.save(timesheetRes)

      const newWorkers = workers.map(worker => ({
        ...worker,
        worker: worker.worker,
        timesheet: timesheetRes.id,
      }))

      this.rulesWorkersService.validateRules(container, String(work_id), newWorkers)

      await this.timesheetWorkersService.createMany(newWorkers)

      return { message: 'Timesheet created successfully' }
    } catch (error) {
      throw error
    }
  }

  async validateRules(rules: Rule[], container: ContainerDto) {
    let totalExtraCharges = 0
    for (const rule of rules) {
      const listExtraCharges = []
      const conditionGroups = rule.condition_groups
      let ruleIsValid = false
      const extraRules = rule.extra_rules

      for (const group of conditionGroups) {
        const conditions = group.conditions
        let groupIsValid = true
        for (const condition of conditions) {
          const conditionResult = this.conditionsService.evalutedConditions(condition, container)
          if (!conditionResult) {
            const isAppliedExtraRule = this.isValidExtraRules(
              extraRules,
              container,
              condition.field,
              listExtraCharges,
              rule.rate,
            )
            if (!isAppliedExtraRule || !isAppliedExtraRule.rate) {
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
        if (listExtraCharges.length) totalExtraCharges = listExtraCharges.reduce((acc, curr) => acc + curr.rate, 0)
        const obj = { name: rule.name, rate: rule.rate, extraCharge: listExtraCharges }
        return { rate: Number(rule.rate) + Number(totalExtraCharges), base: Number(rule.rate), json: obj }
      }
    }

    return 0
  }

  private isValidExtraRules(
    extraRules: ExtraRule[],
    container: ContainerDto,
    field: string,
    listExtraCharges: any[],
    baseRate = 0,
  ) {
    if (!extraRules.length) return false
    const filterExtraRules = extraRules.filter(rule => rule.unit === field)
    let valueTotal = 0
    const extraRulesApplied = []
    for (const extraRule of filterExtraRules) {
      let fields = new Set()
      const conditionGroups = extraRule.condition_groups
      let ruleIsValid = false

      for (const group of conditionGroups) {
        const conditions = group.conditions
        let groupIsValid = true

        for (const condition of conditions) {
          const conditionResult = this.conditionsService.evalutedConditions(condition, container)
          if (!conditionResult) {
            groupIsValid = false
            break
          }
          fields.add(condition.field)
        }

        if (groupIsValid) {
          ruleIsValid = true
          break
        }
      }

      if (ruleIsValid) {
        const extraRate = this.calculateUnitsOverLimit(fields, container, extraRule, baseRate)
        valueTotal += extraRate
        listExtraCharges.push({ name: extraRule.name, rate: extraRate })
      }
    }
    return { rate: valueTotal, json: extraRulesApplied }
  }

  private calculateUnitsOverLimit(fields: Set<any>, container: ContainerDto, extraRule: ExtraRule, baseRate = 0) {
    let value = 0
    for (const field of fields) {
      const fieldValueContainer = container[field]
      if (fieldValueContainer) {
        const maxValue = this.getMaxValue(extraRule, extraRule.unit)
        if (extraRule.rate_type === 'per_item') {
          const diff = fieldValueContainer - maxValue
          value = extraRule.rate * diff
        }

        if (extraRule.rate_type === 'percentage') {
          value = (extraRule.rate / 100) * baseRate
        }

        if (extraRule.rate_type === 'fixed') {
          value = Number(extraRule.rate)
        }
      }
    }

    return value
  }

  private getMaxValue(rule: Rule | ExtraRule, unit: string) {
    let value = 0
    const conditionGroups = rule.condition_groups
    for (const group of conditionGroups) {
      const conditions = group.conditions.filter(condition => condition.field === unit)

      for (const condition of conditions) {
        const conditionValue = Number(condition.value)
        value = value > conditionValue ? value : conditionValue
      }
    }

    return value
  }

  async findTimesheetById(id: number) {
    const timesheet = await this.timesheetRepository.findOne({
      where: { id },
      relations: [
        'timesheet_workers',
        'timesheet_workers.worker',
        'customer',
        'container',
        'container.work',
        'container.product',
      ],
    })
    if (!timesheet) throw new NotFoundException('Timesheet not found')

    return timesheet
  }

  async getCustomerRelations(customer: number) {
    const resultCustomer = await this.usersService.findOne({
      where: { id: customer, active: true, role: ROLES_CONST.CUSTOMER },
      relations: ['rules', 'rules.condition_groups', 'rules.condition_groups.conditions'],
    })
    if (!resultCustomer) throw new NotFoundException('Customer not found')

    return resultCustomer
  }

  async find(payload: any, page, pageSize) {
    // const { role, id } = payload
    if ('CUSTOMER' === ROLES_CONST.CUSTOMER) {
      const [result, total] = await this.timesheetRepository.findAndCount({
        // where: { customer: id },
        skip: (page - 1) * pageSize,
        take: pageSize,
      })
      return { result, pagination: { page, pageSize, total } }
    }
  }

  async findByCustomer(customerId: number, page: number, pageSize: number) {
    const [result, total] = await this.timesheetRepository.findAndCount({
      where: { customer: { id: customerId } },
      relations: ['timesheet_workers', 'customer', 'container', 'container.work'],
      skip: page * pageSize,
      take: pageSize,
      order: {
        created_at: 'DESC',
      },
    })
    return { result, pagination: { page, pageSize, total } }
  }

  async findTimesheetByWorker(workerId: number, page: number, pageSize: number) {
    const [result, total] = await this.timesheetRepository.findAndCount({
      where: { timesheet_workers: { worker: { id: In([workerId]) } } },
      relations: ['timesheet_workers', 'customer', 'container', 'container.work'],
    })
    return { result, pagination: { page, pageSize, total } }
  }
}
