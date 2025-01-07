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

  select() {
    return this.overtimeRepository.find()
  }

  findById(id: number) {
    return this.overtimeRepository.findOne({ where: { id } })
  }

  async selectAll({ page, pageSize }: { page: number; pageSize: number }) {
    const [result, total] = await this.overtimeRepository.findAndCount({
      skip: page * pageSize,
      take: pageSize,
    })

    return { result, pagination: { page, pageSize, total } }
  }

  async update(id: number, updateOvertimeDto: UpdateOvertimeDto) {
    const overtime = await this.overtimeRepository.findOne({ where: { id } })
    if (!overtime) throw new NotFoundException(`Overtime with ID ${id} not found`)

    Object.assign(overtime, updateOvertimeDto)
    return this.overtimeRepository.save(overtime)
  }

  validateOvertimes(overtimes: Overtime[], hoursWorked: number, upHours: number) {
    overtimes.sort((a, b) => a.number - b.number)
    const diffHours = hoursWorked - upHours

    for (const overtime of overtimes) {
      if (overtime.hours <= diffHours) {
        return overtime
      }
    }

    return false
  }
}
