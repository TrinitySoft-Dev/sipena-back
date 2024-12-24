import { Injectable } from '@nestjs/common'
import { CreateExtraRulesWorkerDto } from './dto/create-extra_rules_worker.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { ExtraRulesWorker } from './entities/extra_rules_worker.entity'
import { Repository } from 'typeorm'

@Injectable()
export class ExtraRulesWorkersService {
  constructor(
    @InjectRepository(ExtraRulesWorker) private readonly extraRulesWorkerRepository: Repository<ExtraRulesWorker>,
  ) {}

  async create(createExtraRulesWorkerDto: CreateExtraRulesWorkerDto) {
    console.log('createExtraRulesWorkerDto', JSON.stringify(createExtraRulesWorkerDto, null, 2))
    return await this.extraRulesWorkerRepository.save(createExtraRulesWorkerDto)
  }
}
