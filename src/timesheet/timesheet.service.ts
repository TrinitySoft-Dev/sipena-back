import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
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
import { UpdateTimesheetDto } from './dto/update-timesheet.dto'
import { DateTime } from 'luxon'
import { ProductsService } from '@/products/products.service'
import { TimesheetStatusEnum } from '@/timesheet_workers/entities/timesheet_worker.entity'
import { NormalScheduleService } from '@/normal_schedule/normal_schedule.service'
import { ContainerSizeService } from '@/container_size/container_size.service'

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
    private readonly normalScheduleService: NormalScheduleService,
    private readonly containerSizeService: ContainerSizeService,
  ) {}

  async create(createTimesheetDto: CreateTimesheetDto) {
    try {
      const { timesheet, container } = createTimesheetDto

      const preparedData = await this.prepareTimesheetData({
        timesheet,
        container,
      })

      const createdContainer = await this.containerService.create(preparedData.containerData)

      const timesheetEntity = this.timesheetRepository.create({
        ...preparedData.timesheetData,
        container: createdContainer,
        customer: { id: timesheet.customer_id },
      })

      await this.timesheetRepository.save(timesheetEntity)

      const workersPayload = await this.processWorkersPayments({
        workers: timesheet.workers,
        container: container,
        configuration: preparedData.configuration,
        payWorker: preparedData.payWorker,
      })

      workersPayload.forEach(worker => {
        worker.timesheet = timesheetEntity.id
      })

      await this.timesheetWorkersService.createMany(workersPayload)

      return { message: 'Timesheet created successfully' }
    } catch (error) {
      throw error
    }
  }

  async update(id: number, updateTimesheetDto: UpdateTimesheetDto) {
    try {
      const existingTimesheet = await this.timesheetRepository.findOne({
        where: { id },
        relations: ['container', 'timesheet_workers', 'customer'],
      })
      if (!existingTimesheet) throw new NotFoundException('Timesheet not found')

      const { timesheet, container } = updateTimesheetDto

      const preparedData = await this.prepareTimesheetData({
        timesheet,
        container,
      })

      Object.assign(container, preparedData.containerData)

      await this.containerService.update(existingTimesheet.container.id, container)

      Object.assign(existingTimesheet, preparedData.timesheetData)
      await this.timesheetRepository.save(existingTimesheet)

      const workersPayload = await this.processWorkersPayments({
        workers: timesheet.workers,
        container: container,
        configuration: preparedData.configuration,
      })
      await this.timesheetWorkersService.updateMany(workersPayload)

      return { message: 'Timesheet updated successfully' }
    } catch (error) {
      throw error
    }
  }

  private async prepareTimesheetData(params: { timesheet: any; container: any }): Promise<{
    timesheetData: Partial<Timesheet>
    containerData: any
    configuration: {
      isValidProduct: boolean
      rate: any
      totalPayWorker: number
    }
    payWorker?: number
  }> {
    let { timesheet, container } = params

    Object.keys(container).forEach(key => {
      if (container[key] === '') container[key] = null
    })

    let isValidProduct = false
    let rate = null
    let totalOvertimes = 0
    let nameSchedule = null
    let isValidSchedule = false
    let totalPayWorker = 0

    const existProductsWithPricing = await this.productsService.findById(container.product)
    if (existProductsWithPricing && existProductsWithPricing.price > 0) {
      isValidProduct = true
    }

    if (!isValidProduct) {
      const customerUser = await this.usersService.findByWorks(timesheet.customer_id, timesheet.work_id, container.size)
      if (customerUser.normal_schedule?.length) {
        const validNormalSchedule: any = await this.normalScheduleService.validateNormalSchedule(
          customerUser.normal_schedule,
          timesheet.work_id,
          container,
          timesheet.day.toString(),
          timesheet.workers,
        )
        if (validNormalSchedule?.rate) {
          isValidSchedule = true
          nameSchedule = validNormalSchedule.name
          totalPayWorker = validNormalSchedule.rate_worker
          if (validNormalSchedule?.overtime) totalOvertimes = validNormalSchedule.overtime
          rate = validNormalSchedule.rate
        }
      }

      if (!isValidProduct && !rate) {
        if (!customerUser.rules.length) {
          throw new BadRequestException(
            'No se encontró ningún tipo de cobro (producto, horario, reglas), revise la configuración del cliente',
          )
        }
        rate = await this.validateRules(customerUser.rules, container)
      }
    }

    const timesheetData: Partial<Timesheet> = {
      day: timesheet.day,
      week: timesheet.week,
      images: timesheet.images,
      rate: this.calculateRate({ isValidProduct, isValidSchedule, rate, existProductsWithPricing, totalOvertimes }),
      base: this.calculateBase({ isValidProduct, isValidSchedule, rate, existProductsWithPricing, totalOvertimes }),
      extra_rates: this.calculateExtraRates({
        isValidProduct,
        rate,
        existProductsWithPricing,
        totalOvertimes,
        nameSchedule,
      }),
    }

    const containerData = { ...container }
    if (container.product) {
      containerData.product = container.product
    }

    return {
      timesheetData,
      containerData,
      configuration: { isValidProduct, rate, totalPayWorker },
      payWorker: existProductsWithPricing?.pay_worker || 0,
    }
  }

  private async processWorkersPayments(params: {
    workers: any[]
    container: any
    configuration: {
      isValidProduct: boolean
      rate: any
      totalPayWorker?: number
    }
    payWorker?: number
  }): Promise<any[]> {
    const { workers, container, configuration } = params
    let payWorkers = []
    const { isValidProduct, rate, totalPayWorker } = configuration

    if (isValidProduct) {
      const payPerWorker = params.payWorker / workers.length
      payWorkers = workers.map(worker => ({
        ...worker,
        pay: payPerWorker,
      }))
    } else if (totalPayWorker) {
      payWorkers = workers.map(worker => {
        const defaultHoursWorked = 8
        const timeOut = DateTime.fromISO(worker.time_out.toString()).minute
        const timeBreak = DateTime.fromISO(worker.break.toString()).minute
        let hoursWorked = defaultHoursWorked - timeOut / 60
        if (timeBreak) hoursWorked -= timeBreak / 60
        return {
          ...worker,
          pay: totalPayWorker * hoursWorked,
        }
      })
    } else {
      payWorkers = await this.rulesWorkersService.validateRules(container, String(container.work), workers)
    }

    return payWorkers
  }

  async closeTimesheet(id: number) {
    const timesheet = await this.timesheetRepository.findOne({ where: { id } })
    if (!timesheet) throw new NotFoundException('Timesheet not found')

    timesheet.status_customer_pay = TimesheetStatusEnum.CLOSED
    await this.timesheetRepository.save(timesheet)
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
        .leftJoinAndSelect('container.size', 'size')
        .leftJoinAndSelect('timesheet.timesheet_workers', 'timesheet_workers')
        .leftJoinAndSelect('timesheet_workers.worker', 'worker')
        .where('timesheet.week = :week', { week })
        .andWhere('timesheet.customer = :customerId', { customerId })
        .andWhere('timesheet.status_customer_pay = :status_customer_pay', { status_customer_pay: 'OPEN' })
        .loadRelationCountAndMap('timesheet.number_of_workers', 'timesheet.timesheet_workers')
        .getRawAndEntities()

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
      .leftJoinAndSelect('worker.infoworker', 'infoworker')
      .leftJoinAndSelect('container.size', 'size')
      .where('timesheet.week = :week', { week })
      .andWhere('worker.id = :customerId', { customerId })
      .andWhere('timesheet_workers.status_worker_pay = :status_worker_pay', { status_worker_pay: 'OPEN' })
      .loadRelationCountAndMap('timesheet.number_of_workers', 'timesheet.timesheet_workers')
      .getRawAndEntities()

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

  private async validateRules(rules: Rule[], container: ContainerDto) {
    let totalExtraCharges = 0
    let ruleCode = ''
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
          const cartons = group.conditions
            .filter(condition => condition.field === 'cartons')
            .map(condition => condition.value)
            .join(' - ')
          const skus = group.conditions.filter(condition => condition.field === 'skus').pop().value

          ruleCode = `${cartons} CTNS, ${skus} SKUS`
          ruleIsValid = true
          break
        }
      }

      if (ruleIsValid) {
        if (listExtraCharges.length) totalExtraCharges = listExtraCharges.reduce((acc, curr) => acc + curr.rate, 0)
        const obj = { name: rule.name, rate: rule.rate, extraCharge: listExtraCharges }
        return {
          rate: Number(rule.rate) + Number(totalExtraCharges),
          base: Number(rule.rate),
          json: obj,
          ruleCode,
        }
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

  private calculateRate = data => {
    const { isValidProduct, isValidSchedule, rate, existProductsWithPricing, totalOvertimes } = data
    if (isValidProduct) return existProductsWithPricing.price
    if (isValidSchedule) return rate + (totalOvertimes?.rate ? totalOvertimes.rate : 0)
    if (typeof rate === 'object') return rate.rate
    return 0
  }

  private calculateBase = data => {
    const { isValidProduct, isValidSchedule, rate, existProductsWithPricing, totalOvertimes } = data
    if (isValidProduct) return existProductsWithPricing.price
    if (isValidSchedule) return rate
    if (typeof rate === 'object') return rate.base
    return 0
  }

  private calculateExtraRates = data => {
    const { isValidProduct, isValidSchedule, rate, existProductsWithPricing, totalOvertimes, nameSchedule } = data
    if (isValidProduct) {
      return JSON.stringify({
        name: existProductsWithPricing.name,
        rate: existProductsWithPricing.price,
      })
    }
    if (isValidSchedule) {
      const obj = {
        name: nameSchedule,
        rate,
      }

      if (totalOvertimes) {
        obj['extraCharge'] = [
          {
            name: totalOvertimes.name,
            rate: totalOvertimes.rate,
          },
        ]
      }

      return JSON.stringify(obj)
    }
    if (typeof rate === 'object') return JSON.stringify(rate.json)
    return null
  }
}
