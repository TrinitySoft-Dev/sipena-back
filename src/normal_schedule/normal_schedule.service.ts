import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateNormalScheduleDto } from './dto/create-normal_schedule.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { NormalSchedule } from './entities/normal_schedule.entity'
import { Repository } from 'typeorm'

@Injectable()
export class NormalScheduleService {
  constructor(
    @InjectRepository(NormalSchedule) private readonly normalScheduleRepository: Repository<NormalSchedule>,
  ) {}

  async create(createNormalScheduleDto: CreateNormalScheduleDto, customerId: number) {
    const normalSchedule = await this.normalScheduleRepository
      .createQueryBuilder('normal_schedule')
      .leftJoinAndSelect('normal_schedule.customer', 'customer')
      .where('customer.id = :customerId', { customerId })
      .getOne()

    if (!normalSchedule) {
      return this.normalScheduleRepository.save({
        ...createNormalScheduleDto,
        customer: { id: customerId },
        work: { id: createNormalScheduleDto.work },
      })
    }

    Object.assign(normalSchedule, {
      ...createNormalScheduleDto,
      customer: { id: customerId },
      work: { id: createNormalScheduleDto.work },
    })

    return this.normalScheduleRepository.save(normalSchedule)
  }

  async findByCustomerId(customerId: number) {
    const normalSchedule = await this.normalScheduleRepository
      .createQueryBuilder('normal_schedule')
      .leftJoinAndSelect('normal_schedule.customer', 'customer')
      .leftJoinAndSelect('normal_schedule.work', 'work')
      .where('customer.id = :customerId', { customerId })
      .getOne()

    if (!normalSchedule) {
      throw new NotFoundException('Normal schedule not found')
    }

    return normalSchedule
  }
}
