import { Injectable } from '@nestjs/common'
import { CreateTimesheetWorkerDto } from './dto/create-timesheet_worker.dto'
import { UpdateTimesheetWorkerDto } from './dto/update-timesheet_worker.dto'
import { Repository } from 'typeorm'
import { TimesheetWorker } from './entities/timesheet_worker.entity'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class TimesheetWorkersService {
  constructor(
    @InjectRepository(TimesheetWorker) private readonly timesheetWorkersRepository: Repository<TimesheetWorker>,
  ) {}

  async create(createTimesheetWorkerDto: CreateTimesheetWorkerDto) {
    return await this.timesheetWorkersRepository.save({
      ...createTimesheetWorkerDto,
      worker: { id: createTimesheetWorkerDto.worker },
      timesheet: { id: createTimesheetWorkerDto.timesheet },
    })
  }

  async createMany(createTimesheetWorkerDtos: CreateTimesheetWorkerDto[]) {
    if (!createTimesheetWorkerDtos?.length) return []
    const entities = createTimesheetWorkerDtos.map(dto => ({
      ...dto,
      worker: { id: dto.worker },
      timesheet: { id: dto.timesheet },
    }))

    return await this.timesheetWorkersRepository.save(entities)
  }

  async getPaysheetd(start, end) {
    const totalWorkerPay = await this.timesheetWorkersRepository
      .createQueryBuilder('timesheetWorker')
      .innerJoin('timesheetWorker.timesheet', 'timesheet')
      .where('timesheet.day BETWEEN :start AND :end', { start, end })
      .select('SUM(timesheetWorker.pay)', 'total')
      .getRawOne()

    return totalWorkerPay.total
  }
}
