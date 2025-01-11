import { Injectable } from '@nestjs/common'
import { CreateOvertimesWorkerDto } from './dto/create-overtimes_worker.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { OvertimesWorker } from './entities/overtimes_worker.entity'
import { Repository } from 'typeorm'
import { DateTime } from 'luxon'

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

    if (hoursWorkerd > up_hours) {
      for (const overtime of overtimes) {
        if (hoursWorkerd < overtime.hours) {
          const payOvertimeWorker = overtime.rate * hoursWorkerd
          return payOvertimeWorker
        }
      }
    }
  }
}
