import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateOvertimeDto } from './dto/create-overtime.dto'
import { UpdateOvertimeDto } from './dto/update-overtime.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Overtime } from './entities/overtime.entity'
import { Repository } from 'typeorm'

@Injectable()
export class OvertimesService {
  constructor(@InjectRepository(Overtime) private readonly overtimeRepository: Repository<Overtime>) {}

  create(createOvertimeDto: CreateOvertimeDto) {
    return this.overtimeRepository.save(createOvertimeDto)
  }

  async update(id: number, updateOvertimeDto: UpdateOvertimeDto) {
    const overtime = await this.overtimeRepository.findOne({ where: { id } })
    if (!overtime) throw new NotFoundException(`Overtime with ID ${id} not found`)

    Object.assign(overtime, updateOvertimeDto)
    return this.overtimeRepository.save(overtime)
  }
}
