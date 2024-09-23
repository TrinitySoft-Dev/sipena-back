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

@Injectable()
export class TimesheetService {
  constructor(
    @InjectRepository(Timesheet) private readonly timesheetRepository: Repository<Timesheet>,
    private readonly containerService: ContainerService,
    private readonly usersService: UsersService,
    private readonly conditionsService: ConditionsService,
  ) {}

  async create(createTimesheetDto: CreateTimesheetDto) {
    try {
      const { timesheet, container } = createTimesheetDto
      const { customer_id, workers, work_id } = timesheet

      const customerUser = await this.usersService.findByWorks(customer_id, work_id)
      console.log(customerUser)
      if (!customerUser.rules.length) throw new NotFoundException('Rules not found')

      const rules = customerUser.rules
      const rate = await this.validateRules(rules, container)

      const createdContainer = await this.containerService.create(container)

      const workersUsers = await this.usersService.findWorkers(workers)
      if (workersUsers.length !== workers.length) throw new NotFoundException('Workers not found')

      const timesheetRes = this.timesheetRepository.create({
        ...timesheet,
        rate,
        container: createdContainer,
        customer: customerUser,
        workers: workersUsers,
      })

      await this.timesheetRepository.save(timesheetRes)

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
        return rule.rate
      }
    }

    return 0
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
}
