import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateWorkDto } from './dto/create-work.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Work } from './entities/work.entity'
import { Repository } from 'typeorm'

@Injectable()
export class WorkService {
  constructor(@InjectRepository(Work) private readonly workRepository: Repository<Work>) {}

  async create(createWorkDto: CreateWorkDto) {
    return await this.workRepository.save(createWorkDto)
  }

  async findById(id: number) {
    const work = await this.workRepository.findOne({ where: { id } })
    if (!work) throw new NotFoundException('Work not found')
    return work
  }
}
