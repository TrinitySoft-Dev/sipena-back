import { Injectable, NotFoundException } from '@nestjs/common'
import { ContainerDto, CreateTimesheetDto } from './dto/create-timesheet.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Timesheet, TimesheetStatusEnum } from './entities/timesheet.entity'
import { Between, In, Repository } from 'typeorm'
import { ContainerService } from '@/container/container.service'
import { UsersService } from '@/users/users.service'
import { Rule } from '@/rules/entities/rule.entity'
import { ROLES_CONST } from '@/common/conts/roles.const'
import { ConditionsService } from '@/conditions/conditions.service'
import { TimesheetWorkersService } from '@/timesheet_workers/timesheet_workers.service'
import { ExtraRule } from '@/extra_rules/entities/extra_rule.entity'
import { RulesWorkersService } from '@/rules_workers/rules_workers.service'
import { randomUUID } from 'crypto'
import { UpdateTimesheetDto } from './dto/update-timesheet.dto'
import { FILTER_TYPE } from '@/common/enums/enums'
import { DateTime } from 'luxon'

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

      const payWorkers = await this.rulesWorkersService.validateRules(container, String(work_id), newWorkers)
      await this.timesheetWorkersService.createMany(payWorkers)

      return { message: 'Timesheet created successfully' }
    } catch (error) {
      throw error
    }
  }

  async getMetricsTimesheet(startDate: string, endDate: string) {
    const start = DateTime.fromISO(startDate).toJSDate()
    const end = DateTime.fromISO(endDate).toJSDate()

    const totalTimesheets = await this.timesheetRepository.count({
      where: {
        day: Between(start, end),
      },
    })

    const totalCustomerRevenue = await this.timesheetRepository
      .createQueryBuilder('timesheet')
      .where('timesheet.day BETWEEN :start AND :end', { start, end })
      .select('SUM(timesheet.rate)', 'total')
      .getRawOne()

    const totalWorkerPay = await this.timesheetWorkersService.getPaysheetd(start, end)

    const monthlyData = await this.timesheetRepository
      .createQueryBuilder('timesheet')
      .leftJoinAndSelect('timesheet.timesheet_workers', 'timesheetWorker')
      .select([
        "DATE_TRUNC('month', timesheet.day) AS month",
        'SUM(timesheet.rate) AS total_rate',
        'SUM(timesheetWorker.pay) AS total_pay',
        '(SUM(timesheet.rate) - SUM(timesheetWorker.pay)) AS net_gain',
      ])
      .where('timesheet.day BETWEEN :start AND :end', { start, end })
      .groupBy("DATE_TRUNC('month', timesheet.day)")
      .orderBy("DATE_TRUNC('month', timesheet.day)", 'ASC')
      .getRawMany()

    console.log(totalCustomerRevenue, totalWorkerPay)

    return {
      totalTimesheets,
      totalCustomerRevenue: parseFloat(totalCustomerRevenue?.total || '0'),
      totalWorkerPay: parseFloat(totalWorkerPay || '0'),
      monthlyData: monthlyData.map(data => ({
        month: data.month,
        totalRate: parseFloat(data.total_rate || '0'),
        totalPay: parseFloat(data.total_pay || '0'),
        netGain: parseFloat(data.net_gain || '0'),
      })),
    }
  }

  private async validateRules(rules: Rule[], container: ContainerDto) {
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
      where: { id: customer, active: true, role: { name: 'ROLES_CONST.CUSTOMER' } },
      relations: ['rules', 'rules.condition_groups', 'rules.condition_groups.conditions'],
    })
    if (!resultCustomer) throw new NotFoundException('Customer not found')

    return resultCustomer
  }

  async find(payload: any, page, pageSize) {
    const { role, id } = payload
    if ('CUSTOMER' === ROLES_CONST.CUSTOMER) {
      const [result, total] = await this.timesheetRepository.findAndCount({
        where: { customer: id },
        skip: page * pageSize,
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

  async findTimesheetsByWeek(week: string, customerId: number) {
    const result = await this.timesheetRepository
      .createQueryBuilder('timesheet')
      .leftJoinAndSelect('timesheet.container', 'container')
      .leftJoinAndSelect('container.work', 'work')
      .leftJoinAndSelect('container.product', 'product')
      .leftJoinAndSelect('timesheet.customer', 'customer')
      .where('timesheet.week = :week', { week })
      .andWhere('timesheet.customer = :customerId', { customerId })
      .andWhere('timesheet.status = :status', { status: 'OPEN' })
      .getRawMany()

    return result
  }

  async findWeekByOpenTimesheet() {
    const result = await this.timesheetRepository
      .createQueryBuilder('timesheet')
      .select('timesheet.week')
      .where('timesheet.status = :status', { status: 'OPEN' })
      .orderBy('timesheet.week', 'ASC')
      .groupBy('timesheet.week')
      .getRawMany()

    const flattened = result.map(item => item.timesheet_week)
    return flattened
  }

  async getOpenTimesheetsWorkerByWeek() {
    const timesheets = await this.timesheetRepository.find({
      where: { status_customer_pay: TimesheetStatusEnum.OPEN },
      relations: ['customer', 'timesheet_workers', 'timesheet_workers.worker'],
    })

    const uniqueWorkers = new Set<string>()
    const groupedByWeek = timesheets.reduce(
      (acc, timesheet) => {
        const week: string = timesheet.week as string
        if (!acc[week]) {
          acc[week] = { workers: [] }
        }

        for (const timesheetWorker of timesheet.timesheet_workers) {
          const worker = timesheetWorker.worker
          if (worker && !uniqueWorkers.has(worker.name)) {
            uniqueWorkers.add(worker.name)
            acc[week].workers.push({
              id: worker.id,
              name: worker.name,
              last_name: worker.last_name,
            })
          }
        }

        return acc
      },
      {} as Record<string, { workers: { id: number; name: string; last_name: string }[] }>,
    )

    return Object.keys(groupedByWeek)
      .map(week => ({
        week,
        workers: groupedByWeek[week].workers,
      }))
      .filter(item => item.workers.length > 0)
  }

  async closeTimesheetWorker(ids: number[]) {
    const timesheets = await this.timesheetRepository.find({ where: { id: In(ids) } })
    if (!timesheets.length) throw new NotFoundException('Timesheet not found')

    timesheets.forEach(timesheet => {
      timesheet.status_customer_pay = TimesheetStatusEnum.CLOSED
    })

    await this.timesheetRepository.save(timesheets)

    return { message: 'Timesheet closed successfully' }
  }

  async findByWeekAndRole(week: string, role: string, id: number) {
    if (role === ROLES_CONST.CUSTOMER) {
      return this.timesheetRepository.find({
        where: { week, customer: { role: { name: ROLES_CONST.CUSTOMER }, id } },
        relations: ['customer', 'container', 'container.work', 'container.product', 'timesheet_workers', 'role'],
      })
    }

    return await this.timesheetRepository.find({
      where: { week, timesheet_workers: { worker: { role: { name: ROLES_CONST.WORKER }, id } } },
      relations: ['customer', 'container', 'container.work', 'container.product', 'timesheet_workers'],
    })
  }

  async update(id: number, data: UpdateTimesheetDto) {
    const timesheet = await this.timesheetRepository.findOne({ where: { id } })
    if (!timesheet) throw new NotFoundException('Timesheet not found')

    Object.assign(timesheet, data)
    await this.timesheetRepository.save(timesheet)

    return { message: 'Timesheet updated successfully' }
  }
}
