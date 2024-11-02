import { Injectable, NotFoundException } from '@nestjs/common'
import { ContainerDto, CreateTimesheetDto } from './dto/create-timesheet.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Timesheet } from './entities/timesheet.entity'
import { Repository } from 'typeorm'
import { ContainerService } from '@/container/container.service'
import { UsersService } from '@/users/users.service'
import { Rule } from '@/rules/entities/rule.entity'
import { ROLES_CONST } from '@/common/conts/roles.const'
import { ConditionsService } from '@/conditions/conditions.service'
import { TimesheetWorkersService } from '@/timesheet_workers/timesheet_workers.service'
import { ExtraRule } from '@/extra_rules/entities/extra_rule.entity'

@Injectable()
export class TimesheetService {
  constructor(
    @InjectRepository(Timesheet) private readonly timesheetRepository: Repository<Timesheet>,
    private readonly containerService: ContainerService,
    private readonly usersService: UsersService,
    private readonly conditionsService: ConditionsService,
    private readonly timesheetWorkersService: TimesheetWorkersService,
  ) {}

  async create(createTimesheetDto: CreateTimesheetDto) {
    try {
      const { timesheet, container } = createTimesheetDto
      let { customer_id, workers, work_id, ...restTimesheet } = timesheet

      const customerUser = await this.usersService.findByWorks(customer_id, work_id)
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

      await this.timesheetWorkersService.createMany(newWorkers)

      return { message: 'Timesheet created successfully' }
    } catch (error) {
      throw error
    }
  }

  async validateRules(rules: Rule[], container: ContainerDto) {
    const extra_charges = {}
    for (const rule of rules) {
      let extraCharge = 0
      const conditionGroups = rule.condition_groups
      let ruleIsValid = false
      const extraRules = rule.extra_rules

      for (const group of conditionGroups) {
        const conditions = group.conditions
        let groupIsValid = true
        for (const condition of conditions) {
          const conditionResult = this.conditionsService.evalutedConditions(condition, container)
          if (!conditionResult) {
            const isAppliedExtraRule = this.isValidExtraRules(extraRules, container, condition.field)

            if (!isAppliedExtraRule) {
              groupIsValid = false
              break
            }

            extraCharge = isAppliedExtraRule.rate
          }
        }

        if (groupIsValid) {
          ruleIsValid = true
          break
        }
      }

      if (ruleIsValid) {
        extra_charges[rule.name] = extraCharge
        const obj = { ...rule, extra_charges }
        return { rate: Number(rule.rate) + Number(extraCharge), json: obj }
      }
    }

    return 0
  }

  private isValidExtraRules(extraRules: ExtraRule[], container: ContainerDto, field: string) {
    let extraCharge = {}
    for (const extraRule of extraRules) {
      let fields = new Set()
      const conditionGroups = extraRule.condition_groups
      let ruleIsValid = false

      for (const group of conditionGroups) {
        const conditions = group.conditions
        let groupIsValid = true
        const existCondition = conditions.filter(condition => condition.field === field)

        if (!existCondition) return false

        for (const condition of existCondition) {
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
        extraCharge = this.calculateUnitsOverLimit(fields, container, extraRule)
        const extraRate = this.calculateUnitsOverLimit(fields, container, extraRule)
        return { rate: extraRate, json: extraCharge }
      }
    }
  }

  private calculateUnitsOverLimit(fields: Set<any>, container: ContainerDto, extraRule: ExtraRule) {
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
          value = (extraRule.rate / 100) * fieldValueContainer
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

  async getCustomerRelations(customer: number) {
    const resultCustomer = await this.usersService.findOne({
      where: { id: customer, active: true, role: ROLES_CONST.CUSTOMER },
      relations: ['rules', 'rules.condition_groups', 'rules.condition_groups.conditions'],
    })
    if (!resultCustomer) throw new NotFoundException('Customer not found')

    return resultCustomer
  }

  async find(payload: any) {
    const { role, id } = payload

    if (role === ROLES_CONST.CUSTOMER) {
      return await this.timesheetRepository.find({
        where: { customer: id },
      })
    }
  }

  async findByCustomer(customerId: number) {
    return await this.timesheetRepository.find({
      where: { customer: { id: customerId } },
      relations: ['timesheet_workers', 'customer', 'container', 'container.work'],
    })
  }
}
