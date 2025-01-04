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

  async create(createNormalScheduleDto: CreateNormalScheduleDto) {
    return this.normalScheduleRepository.save({
      ...createNormalScheduleDto,
      work: { id: createNormalScheduleDto.work },
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

  async remove(id: number) {
    const result = await this.normalScheduleRepository.softDelete(id)
    if (result.affected === 0) {
      throw new NotFoundException('Normal schedule not found')
    }

    return { message: 'Normal schedule deleted' }
  }
}
