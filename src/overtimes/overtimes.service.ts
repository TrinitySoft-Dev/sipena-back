import { Injectable } from '@nestjs/common'
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
}
