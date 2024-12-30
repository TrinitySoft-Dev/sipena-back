import { Injectable, NotFoundException } from '@nestjs/common'
import { ContainerDto, CreateTimesheetDto } from './dto/create-timesheet.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Timesheet } from './entities/timesheet.entity'
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
import { ProductsService } from '@/products/products.service'
import { TimesheetStatusEnum } from '@/timesheet_workers/entities/timesheet_worker.entity'

@Injectable()
export class TimesheetService {
  constructor(
    @InjectRepository(Timesheet) private readonly timesheetRepository: Repository<Timesheet>,
    private readonly containerService: ContainerService,
    private readonly usersService: UsersService,
    private readonly conditionsService: ConditionsService,
    private readonly timesheetWorkersService: TimesheetWorkersService,
    private readonly rulesWorkersService: RulesWorkersService,
    private readonly productsService: ProductsService,
  ) {}

  async create(createTimesheetDto: CreateTimesheetDto) {
    try {
      const { timesheet, container } = createTimesheetDto
      let { customer_id, workers, work_id, ...restTimesheet } = timesheet

      let isValidProduct = false
      let rate = null
      const existProductsWithPricing = await this.productsService.findById(container.product)
      const appliedPriceProduct = existProductsWithPricing?.price > 0 ? true : false

      if (existProductsWithPricing && existProductsWithPricing.price > 0) {
        isValidProduct = true
      }

      if (!appliedPriceProduct) {
        const customerUser = await this.usersService.findByWorks(customer_id, work_id, container.size)
        if (!customerUser.rules.length) throw new NotFoundException('Rules not found')

        const rules = customerUser.rules
        rate = await this.validateRules(rules, container)
      }

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
        rate: appliedPriceProduct ? existProductsWithPricing.price : typeof rate === 'object' ? rate.rate : 0,
        base: appliedPriceProduct ? existProductsWithPricing.price : typeof rate === 'object' ? rate.base : 0,
        container: createdContainer,
        customer: { id: customer_id },
        extra_rates: isValidProduct
          ? JSON.stringify({
              name: existProductsWithPricing.name,
              rate: existProductsWithPricing.price,
            })
          : typeof rate === 'object'
            ? JSON.stringify(rate.json)
            : null,
      })

      await this.timesheetRepository.save(timesheetRes)

      const newWorkers = workers.map(worker => ({
        ...worker,
        worker: worker.worker,
        timesheet: timesheetRes.id,
      }))

      let payWorkers = []
      if (!isValidProduct) {
        payWorkers = await this.rulesWorkersService.validateRules(container, String(work_id), newWorkers)
      }

      if (isValidProduct) {
        payWorkers = newWorkers.map(worker => ({ ...worker, pay: existProductsWithPricing.price / workers.length }))
      }

      await this.timesheetWorkersService.createMany(payWorkers)

      return { message: 'Timesheet create successfully' }
    } catch (error) {
      throw error
    }
  }

  async update(id: number, updateTimesheetDto: UpdateTimesheetDto) {
    const { timesheet, container } = updateTimesheetDto

    if (container?.trash) container.trash = (container.trash as unknown as string) === 'true'
    if (container?.mixed) container.mixed = (container.mixed as unknown as string) === 'true'
    if (container?.forklift_driver) container.forklift_driver = Boolean(container.forklift_driver)

    const existingTimesheet = await this.timesheetRepository.findOne({
      where: { id },
      relations: ['container', 'timesheet_workers', 'customer', 'container.work', 'container.size'],
    })

    if (!existingTimesheet) throw new NotFoundException('Timesheet not found')

    // update workers
    const idWorkers = timesheet.workers.map(worker => worker.id)
    const workers = existingTimesheet.timesheet_workers

    const workerUpdate = workers.filter(worker => idWorkers.includes(worker.id))
    Object.assign(workerUpdate, timesheet.workers)

    existingTimesheet.timesheet_workers = workerUpdate

    // update container
    Object.assign(existingTimesheet.container, container)
    const customerId = existingTimesheet.customer.id

    let isValidProduct = false
    let rate = null

    const existProductsWithPricing = await this.productsService.getProductsCustomerWithPrice(customerId)

    if (existProductsWithPricing) {
      isValidProduct = true
    }

    if (!existProductsWithPricing) {
      const customerUser = await this.usersService.findByWorks(
        customerId,
        Number(existingTimesheet.container.work),
        Number(existingTimesheet.container.size),
      )
      if (!customerUser.rules.length) throw new NotFoundException('Rules not found')

      const rules = customerUser.rules
      rate = await this.validateRules(rules, container)
    }

    existingTimesheet.rate = isValidProduct ? existProductsWithPricing.price : typeof rate === 'object' ? rate.rate : 0
    existingTimesheet.base = isValidProduct ? existProductsWithPricing.price : typeof rate === 'object' ? rate.base : 0

    existingTimesheet.extra_rates = isValidProduct
      ? JSON.stringify({
          name: existProductsWithPricing.name,
          rate: existProductsWithPricing.price,
        })
      : typeof rate === 'object'
        ? JSON.stringify(rate.json)
        : null

    await this.timesheetRepository.save(existingTimesheet)

    let payWorkers = []

    if (!isValidProduct) {
      payWorkers = await this.rulesWorkersService.validateRules(
        container,
        String(existingTimesheet.container.work),
        workerUpdate,
      )
    }

    if (isValidProduct) {
      payWorkers = workerUpdate.map(worker => ({
        ...worker,
        pay: existProductsWithPricing.price / workerUpdate.length,
      }))
    }

    await this.timesheetWorkersService.updateMany(payWorkers)

    return { message: 'Timesheet updated successfully' }
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
        'container.size',
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
      relations: ['timesheet_workers', 'timesheet_workers.worker', 'customer', 'container', 'container.work'],
      skip: page * pageSize,
      take: pageSize,
      order: {
        created_at: 'DESC',
      },
    })
    const mappedResult = result.map(timesheet => ({
      id: timesheet.id,
      day: timesheet.day,
      week: timesheet.week,
      created_at: timesheet.created_at,
      delete_at: timesheet.delete_at,
      updated_at: timesheet.updated_at,
      timesheet_workers: timesheet.timesheet_workers.map(tw => ({
        id: tw.id,
        worker: {
          name: tw.worker.name,
          last_name: tw.worker.last_name,
          email: tw.worker.email,
        },
        pay: tw.pay,
      })),
      customer: {
        id: timesheet.customer.id,
        email: timesheet.customer.email,
        name: timesheet.customer.name,
        last_name: timesheet.customer.last_name,
      },
      container: timesheet.container,
    }))

    return { result: mappedResult, pagination: { page, pageSize, total } }
  }

  async findTimesheetsByWeek(week: string, customerId: number, type: string) {
    if (type === ROLES_CONST.CUSTOMER) {
      const result = await this.timesheetRepository
        .createQueryBuilder('timesheet')
        .leftJoinAndSelect('timesheet.container', 'container')
        .leftJoinAndSelect('container.work', 'work')
        .leftJoinAndSelect('container.product', 'product')
        .leftJoinAndSelect('timesheet.customer', 'customer')
        .where('timesheet.week = :week', { week })
        .andWhere('timesheet.customer = :customerId', { customerId })
        .andWhere('timesheet.status_customer_pay = :status_customer_pay', { status_customer_pay: 'OPEN' })
        .getRawMany()

      return result
    }

    const result = await this.timesheetRepository
      .createQueryBuilder('timesheet')
      .leftJoinAndSelect('timesheet.container', 'container')
      .leftJoinAndSelect('container.work', 'work')
      .leftJoinAndSelect('container.product', 'product')
      .leftJoinAndSelect('timesheet.customer', 'customer')
      .leftJoinAndSelect('timesheet.timesheet_workers', 'timesheet_workers')
      .leftJoinAndSelect('timesheet_workers.worker', 'worker')
      .where('timesheet.week = :week', { week })
      .andWhere('worker.id = :customerId', { customerId })
      .andWhere('timesheet.status_customer_pay = :status_customer_pay', { status_customer_pay: 'OPEN' })
      .getRawMany()

    return result
  }

  async findWeekByOpenTimesheet() {
    const result = await this.timesheetRepository
      .createQueryBuilder('timesheet')
      .leftJoinAndSelect('timesheet.customer', 'customer')
      .where('timesheet.status_customer_pay = :status_customer_pay', { status_customer_pay: 'OPEN' })
      .getMany()

    const uniqueCustomers = new Set<string>()
    const groupedByWeek = result.reduce(
      (acc, timesheet) => {
        const week: string = timesheet.week as string
        if (!acc[week]) {
          acc[week] = { customers: [] }
        }

        if (!uniqueCustomers.has(timesheet.customer.name)) {
          uniqueCustomers.add(timesheet.customer.name)
          acc[week].customers.push({
            id: timesheet.customer.id,
            name: timesheet.customer.name,
            last_name: timesheet.customer.last_name,
          })
        }

        return acc
      },
      {} as Record<string, { customers: { id: number; name: string; last_name: string }[] }>,
    )

    return Object.keys(groupedByWeek)
      .map(week => ({
        week,
        customers: groupedByWeek[week].customers,
      }))
      .filter(item => item.customers.length > 0)
  }

  async getOpenTimesheetsWorkerByWeek(workerId: number, timesheetStatus: string) {
    const timesheets = this.timesheetRepository
      .createQueryBuilder('timesheet')
      .innerJoinAndSelect(
        'timesheet.timesheet_workers',
        'timesheet_workers',
        'timesheet_workers.status_worker_pay = :status',
        { status: TimesheetStatusEnum[timesheetStatus] },
      )
      .leftJoinAndSelect('timesheet.customer', 'customer')
      .leftJoinAndSelect('timesheet_workers.worker', 'worker')

    if (workerId) {
      timesheets.where('timesheet_workers.worker = :workerId', { workerId })
    }
    const resultTimesheets = await timesheets.getMany()

    const groupedByWeek = resultTimesheets.reduce(
      (acc, timesheet) => {
        const week: string = timesheet.week as string
        if (!acc[week]) {
          acc[week] = { workers: [], uniqueWorkers: new Set<string>() }
        }

        for (const timesheetWorker of timesheet.timesheet_workers) {
          const worker = timesheetWorker.worker
          if (worker && !acc[week].uniqueWorkers.has(worker.name)) {
            acc[week].uniqueWorkers.add(worker.name)
            acc[week].workers.push({
              id: worker.id,
              name: worker.name,
              last_name: worker.last_name,
            })
          }
        }

        return acc
      },
      {} as Record<string, { workers: { id: number; name: string; last_name: string }[]; uniqueWorkers: Set<string> }>,
    )

    return Object.keys(groupedByWeek)
      .map(week => ({
        week,
        workers: groupedByWeek[week].workers,
      }))
      .filter(item => item.workers.length > 0)
  }

  async closeTimesheetWorker(ids: number[], idWorker: number) {
    const timesheets = await this.timesheetRepository
      .createQueryBuilder('timesheet')
      .leftJoinAndSelect('timesheet.timesheet_workers', 'timesheet_workers')
      .where('timesheet.id IN (:...ids)', { ids })
      .andWhere('timesheet_workers.worker = :idWorker', { idWorker })
      .getMany()

    if (!timesheets.length) throw new NotFoundException('Timesheet not found')

    timesheets.forEach(timesheet => {
      timesheet.timesheet_workers = timesheet.timesheet_workers.map(worker => ({
        ...worker,
        status_worker_pay: TimesheetStatusEnum.CLOSED,
      }))
    })

    await this.timesheetRepository.save(timesheets)

    return { message: 'Timesheet closed successfully' }
  }

  async closeTimesheetCustomer(ids: number[], idCustomer: number) {
    const timesheets = await this.timesheetRepository
      .createQueryBuilder('timesheet')
      .where('timesheet.id IN (:...ids)', { ids })
      .andWhere('timesheet.customer = :idCustomer', { idCustomer })
      .getMany()

    if (!timesheets.length) throw new NotFoundException('Timesheet not found')

    timesheets.forEach(timesheet => {
      timesheet.status_customer_pay = TimesheetStatusEnum.CLOSED
    })

    await this.timesheetRepository.save(timesheets)

    return { message: 'Timesheet closed successfully' }
  }

  async findByWeekAndRole(week: string, role: string, id: number, timesheetStatus: string) {
    if (role === ROLES_CONST.CUSTOMER) {
      return this.timesheetRepository
        .createQueryBuilder('timesheet')
        .leftJoinAndSelect('timesheet.customer', 'customer')
        .leftJoinAndSelect('customer.role', 'role')
        .leftJoinAndSelect('timesheet.container', 'container')
        .leftJoinAndSelect('container.work', 'work')
        .leftJoinAndSelect('container.product', 'product')
        .leftJoinAndSelect('container.size', 'size')
        .leftJoinAndSelect('timesheet.timesheet_workers', 'timesheet_workers')
        .where('timesheet.week = :week', { week })
        .andWhere('timesheet.customer = :id', { id })
        .andWhere('role.name = :role', { role: ROLES_CONST.CUSTOMER })
        .andWhere('timesheet.status_customer_pay = :status_customer_pay', {
          status_customer_pay: TimesheetStatusEnum[timesheetStatus],
        })
        .getMany()
    }
    return this.timesheetRepository
      .createQueryBuilder('timesheet')
      .innerJoinAndSelect(
        'timesheet.timesheet_workers',
        'timesheet_workers',
        'timesheet_workers.status_worker_pay = :status',
        { status: TimesheetStatusEnum[timesheetStatus] },
      )
      .leftJoinAndSelect('timesheet_workers.worker', 'worker')
      .leftJoinAndSelect('worker.role', 'role')
      .leftJoinAndSelect('timesheet.customer', 'customer')
      .leftJoinAndSelect('timesheet.container', 'container')
      .leftJoinAndSelect('container.work', 'work')
      .leftJoinAndSelect('container.product', 'product')
      .leftJoinAndSelect('container.size', 'size')
      .where('timesheet.week = :week', { week })
      .andWhere('timesheet_workers.worker = :id', { id })
      .andWhere('role.name = :role', { role: ROLES_CONST.WORKER })
      .getMany()
  }
}
