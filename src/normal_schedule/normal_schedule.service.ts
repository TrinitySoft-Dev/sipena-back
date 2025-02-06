import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateNormalScheduleDto } from './dto/create-normal_schedule.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { NormalSchedule } from './entities/normal_schedule.entity'
import { In, Repository } from 'typeorm'
import { DateTime } from 'luxon'
import { ContainerDto } from '@/timesheet/dto/create-timesheet.dto'
import { OvertimesService } from '@/overtimes/overtimes.service'
import { UpdateOvertimeDto } from '@/overtimes/dto/update-overtime.dto'
import { UpdateNormalScheduleDto } from './dto/update-normal_schedule.dto'
import { OvertimesWorkerService } from '@/overtimes_worker/overtimes_worker.service'

@Injectable()
export class NormalScheduleService {
  constructor(
    @InjectRepository(NormalSchedule) private readonly normalScheduleRepository: Repository<NormalSchedule>,
    private readonly overtimeService: OvertimesService,
    private readonly overtimesWorkerService: OvertimesWorkerService,
  ) {}

  async create(createNormalScheduleDto: CreateNormalScheduleDto) {
    return this.normalScheduleRepository.save({
      ...createNormalScheduleDto,
      work: { id: createNormalScheduleDto.work },
      overtimes: createNormalScheduleDto.overtimes.map(overtime => ({ id: overtime })),
    })
  }

  async findOne(id: number) {
    return this.normalScheduleRepository.findOne({ where: { id }, relations: ['work'] })
  }

  async findAll({ page, pageSize }) {
    const [result, total] = await this.normalScheduleRepository.findAndCount({
      skip: page * pageSize,
      take: pageSize,
      relations: ['work'],
    })

    return { result, pagination: { page, pageSize, total } }
  }

  async selectAll() {
    return this.normalScheduleRepository.find()
  }

  async findByCustomer(customerId: number, { page, pageSize }) {
    const [result, total] = await this.normalScheduleRepository.findAndCount({
      where: { customer: { id: customerId } },
      skip: page * pageSize,
      take: pageSize,
      relations: ['work'],
    })

    return { result, pagination: { page, pageSize, total } }
  }

  async update(id: number, updateNormalScheduleDto: UpdateNormalScheduleDto) {
    const normalSchedule = await this.normalScheduleRepository.findOne({ where: { id } })
    if (!normalSchedule) {
      throw new NotFoundException('Normal schedule not found')
    }
    Object.assign(normalSchedule, {
      ...updateNormalScheduleDto,
      overtimes: updateNormalScheduleDto.overtimes.map(overtime => ({ id: overtime })),
    })
    return this.normalScheduleRepository.save(normalSchedule)
  }

  async remove(id: number) {
    const result = await this.normalScheduleRepository.softDelete(id)
    if (result.affected === 0) {
      throw new NotFoundException('Normal schedule not found')
    }

    return { message: 'Normal schedule deleted' }
  }

  async validateNormalSchedule(
    normalSchedules: NormalSchedule[],
    workId: number,
    container: ContainerDto,
    day: string,
    workers: any,
  ) {
    const existNormalScheduleByWork = normalSchedules.filter(
      normalSchedule => normalSchedule.work.id === Number(workId),
    )
    if (!existNormalScheduleByWork.length) return false

    for (const schedule of normalSchedules) {
      const dayWorked = DateTime.fromISO(day.toString()).setLocale('en').toFormat('EEEE')
      const dayIncludeInSchedule = schedule.days.includes(dayWorked)

      if (!dayIncludeInSchedule) continue

      const start = DateTime.fromISO(container.start.toString())
      const finish = DateTime.fromISO(container.finish.toString())

      const totalBreak = workers.reduce((acc, worker) => {
        const workerBreak = DateTime.fromISO(worker.break)
        if (!workerBreak.isValid) {
          return acc
        }
        const totalMinutes = workerBreak.hour * 60 + workerBreak.minute
        return acc + totalMinutes
      }, 0)

      const totalTimeOut = workers.reduce((acc, worker) => {
        const workerTimeOut = DateTime.fromISO(worker.time_out)
        if (!workerTimeOut.isValid) {
          return acc
        }
        const totalMinutes = workerTimeOut.hour * 60 + workerTimeOut.minute
        return acc + totalMinutes
      }, 0)

      const hoursWorked = finish.diff(start, 'hours').hours - (totalBreak - totalTimeOut) / 60

      if (hoursWorked > schedule.up_hours) {
        const appliedOvertime = this.overtimeService.validateOvertimes(
          schedule.overtimes,
          hoursWorked,
          schedule.up_hours,
        )

        if (!appliedOvertime) continue

        const overtimeWorker = await this.overtimesWorkerService.validateOvertimes(hoursWorked, schedule.up_hours)

        return {
          rate: schedule.rate * (hoursWorked > schedule.up_hours ? schedule.up_hours : schedule.rate * hoursWorked),
          name: schedule.name,
          rate_worker: schedule.rate_worker + (overtimeWorker || 0),
          overtime: appliedOvertime,
        }
      }

      return {
        rate: schedule.rate * hoursWorked,
        name: schedule.name,
        rate_worker: schedule.rate_worker,
      }
    }
  }
}
