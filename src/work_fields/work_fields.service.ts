import { Injectable } from '@nestjs/common'
import { CreateWorkFieldDto } from './dto/create-work_field.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { WorkField } from './entities/work_field.entity'
import { Repository } from 'typeorm'

@Injectable()
export class WorkFieldsService {
  constructor(@InjectRepository(WorkField) private readonly workfieldRepository: Repository<WorkField>) {}

  create(createWorkFieldDto: CreateWorkFieldDto) {
    return this.workfieldRepository.save(createWorkFieldDto)
  }

  find() {
    return this.workfieldRepository.find()
  }
}
