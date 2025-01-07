import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateNormalScheduleDto } from './dto/create-normal_schedule.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { NormalSchedule } from './entities/normal_schedule.entity'
import { Repository } from 'typeorm'
import { DateTime } from 'luxon'
import { ContainerDto } from '@/timesheet/dto/create-timesheet.dto'
import { OvertimesService } from '@/overtimes/overtimes.service'

@Injectable()
export class NormalScheduleService {
  constructor(
    @InjectRepository(NormalSchedule) private readonly normalScheduleRepository: Repository<NormalSchedule>,
    private readonly overtimeService: OvertimesService,
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

  async remove(id: number) {
    const result = await this.normalScheduleRepository.softDelete(id)
    if (result.affected === 0) {
      throw new NotFoundException('Normal schedule not found')
    }

    return { message: 'Normal schedule deleted' }
  }

  validateNormalSchedule(normalSchedules: NormalSchedule[], workId: number, container: ContainerDto, day: string) {
    const existNormalScheduleByWork = normalSchedules.filter(normalSchedule => normalSchedule.work.id === workId)
    if (!existNormalScheduleByWork) return false

    for (const schedule of normalSchedules) {
      const dayWorked = DateTime.fromISO(day).weekdayLong
      const dayIncludeInSchedule = schedule.days.includes(dayWorked)

      if (!dayIncludeInSchedule) continue

      const start = DateTime.fromISO(container.start.toString())
      const finish = DateTime.fromISO(container.finish.toString())

      const hoursWorked = finish.diff(start, 'hours').hours

      if (hoursWorked > schedule.up_hours) {
        const appliedOvertime = this.overtimeService.validateOvertimes(
          schedule.overtimes,
          hoursWorked,
          schedule.up_hours,
        )

        if (!appliedOvertime) continue

        return {
          rate: schedule.rate,
          name: schedule.name,
          rate_worker: schedule.rate_worker,
          overtime: appliedOvertime,
        }
      }

      return { rate: schedule.rate }
    }
  }
}
