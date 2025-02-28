import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateOvertimesWorkerDto } from './dto/create-overtimes_worker.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { OvertimesWorker } from './entities/overtimes_worker.entity'
import { Repository } from 'typeorm'
import { DateTime } from 'luxon'
import { UpdateOvertimesWorkerDto } from './dto/update-overtimes_worker.dto'

@Injectable()
export class OvertimesWorkerService {
  constructor(
    @InjectRepository(OvertimesWorker) private readonly overtimesWorkerRepository: Repository<OvertimesWorker>,
  ) {}

  create(createOvertimesWorkerDto: CreateOvertimesWorkerDto) {
    return this.overtimesWorkerRepository.save(createOvertimesWorkerDto)
  }

  async validateOvertimes(hoursWorkerd: number, up_hours: number) {
    const overtimes = await this.overtimesWorkerRepository.find()
    overtimes.sort((a, b) => a.hours - b.hours)

    const diff = hoursWorkerd - up_hours

    if (hoursWorkerd > up_hours) {
      for (const overtime of overtimes) {
        if (diff <= overtime.hours) {
          const payOvertimeWorker = diff * overtime.rate
          return payOvertimeWorker
        }
      }
    }
  }

  async getAllOvertimes(params) {
    const { page, pageSize, name } = params
    let where = {}

    if (name) where = { ...where, name: { $regex: name, $options: 'i' } }

    const [result, total] = await this.overtimesWorkerRepository.findAndCount({
      take: pageSize,
      skip: page * pageSize,
      where,
      order: { created_at: 'DESC' },
    })

    return { result, pagination: { page, pageSize, total } }
  }

  async getById(id: number) {
    const overtime = await this.overtimesWorkerRepository.findOne({ where: { id } })
    if (!overtime) {
      throw new NotFoundException('Overtime not found')
    }

    return overtime
  }

  async select() {
    const overtimes = await this.overtimesWorkerRepository.find()
    return overtimes
  }

  async update(id: number, updateOvertimesWorkerDto: UpdateOvertimesWorkerDto) {
    const overtime = await this.overtimesWorkerRepository.findOne({ where: { id } })
    if (!overtime) {
      throw new NotFoundException('Overtime not found')
    }

    Object.assign(overtime, updateOvertimesWorkerDto)
    return this.overtimesWorkerRepository.save(overtime)
  }

  async remove(id: number) {
    return this.overtimesWorkerRepository.softDelete(id)
  }
}
