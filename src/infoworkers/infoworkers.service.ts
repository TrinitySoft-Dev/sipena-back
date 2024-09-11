import { Injectable } from '@nestjs/common'
import { CreateInfoworkerDto } from './dto/create-infoworker.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Infoworker } from './entities/infoworker.entity'
import { Repository } from 'typeorm'

@Injectable()
export class InfoworkersService {
  constructor(@InjectRepository(Infoworker) private readonly infoworkerRepository: Repository<Infoworker>) {}

  create(createInfoworkerDto: CreateInfoworkerDto): Promise<Infoworker> {
    return this.infoworkerRepository.save(createInfoworkerDto)
  }
}
