import { Injectable, NotFoundException } from '@nestjs/common'
import { ContainerDto, CreateTimesheetDto } from './dto/create-timesheet.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Timesheet } from './entities/timesheet.entity'
import { Repository } from 'typeorm'
import { ContainerService } from '@/container/container.service'
import { UsersService } from '@/users/users.service'
import { RulesService } from '@/rules/rules.service'
import { Rule } from '@/rules/entities/rule.entity'
import { ROLES_CONST } from '@/common/conts/roles.const'

@Injectable()
export class TimesheetService {
  constructor(
    @InjectRepository(Timesheet) private readonly timesheetRepository: Repository<Timesheet>,
    private readonly containerService: ContainerService,
    private readonly usersService: UsersService,
    private readonly rulesService: RulesService,
  ) {}

  async create(createTimesheetDto: CreateTimesheetDto) {
    const { timesheet, container } = createTimesheetDto
    const { customer } = timesheet

    const customerUser = await this.getCustomer(customer)

    // await this.validateRules(rules, container)
  }

  async validateRules(rules: Rule[], container: ContainerDto) {
    // const existRuleProduct = rules.find(rule => rule.type === 'PRODUCT')
    // if (existRuleProduct) {
    // }
  }

  async getCustomer(customer: number) {
    const resultCustomer = await this.usersService.findOne({
      where: { id: customer, active: true, role: ROLES_CONST.CUSTOMER },
    })
    if (!resultCustomer) throw new NotFoundException('Customer not found')
    return resultCustomer
  }
}
