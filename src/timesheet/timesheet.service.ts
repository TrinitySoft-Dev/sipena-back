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
        rate,
        container: createdContainer,
        customer: { id: customer_id },
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
    for (const rule of rules) {
      const conditionGroups = rule.condition_groups
      let ruleIsValid = false

      for (const group of conditionGroups) {
        const conditions = group.conditions
        let groupIsValid = true
        for (const condition of conditions) {
          const conditionResult = this.conditionsService.evalutedConditions(condition, container)
          if (!conditionResult && condition.mandatory) {
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
        return rule.rate
      }
    }

    return 0
  }

  private async validateExtraRules(extraRules: ExtraRule[], container: ContainerDto, baseRate: number) {
    if (!extraRules.length) return 0
    let totalExtraCharge = 0

    for (const extraRule of extraRules) {
      const conditionGroups = extraRule.condition_groups
      let extraRuleIsValid = false

      for (const group of conditionGroups) {
        const conditions = group.conditions
        let groupIsValid = true

        for (const condition of conditions) {
          const conditionResult = this.conditionsService.evalutedConditions(condition, container)
          if (!conditionResult) {
            groupIsValid = false
            break
          }
        }

        if (groupIsValid) {
          extraRuleIsValid = true
          break
        }
      }

      if (extraRuleIsValid) {
        let extraCharge = 0

        if (extraRule.rate_type === 'fixed') {
          extraCharge = extraRule.rate
        } else if (extraRule.rate_type === 'percentage') {
          extraCharge = (extraRule.rate / 100) * baseRate
        } else if (extraRule.rate_type === 'per_unit') {
          const unitsOverLimit = this.calculateUnitsOverLimit(extraRule.unit, container, extraRule.limit)
          extraCharge = unitsOverLimit * extraRule.rate
        }

        totalExtraCharge += extraCharge
      }
    }

    return totalExtraCharge
  }

  private calculateUnitsOverLimit(unit: string, container: ContainerDto, limit: number) {
    let value: number = 0

    if (unit === 'sku') {
      value = Number(container.skus)
    } else if (unit === 'pallet') {
      value = Number(container.pallets)
    }

    const unitsOverLimit = value - limit
    return unitsOverLimit > 0 ? unitsOverLimit : 0
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
