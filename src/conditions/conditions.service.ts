import { Injectable } from '@nestjs/common'
import { CreateConditionDto } from './dto/create-condition.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Condition } from './entities/condition.entity'
import { EntityManager, Repository } from 'typeorm'

@Injectable()
export class ConditionsService {
  constructor(@InjectRepository(Condition) private readonly conditionRepository: Repository<Condition>) {}

  async create(createConditionDto: CreateConditionDto): Promise<Condition> {
    const condition = this.conditionRepository.create(createConditionDto)
    return await this.conditionRepository.save(condition)
  }

  async createMany(createConditionDtos: CreateConditionDto[], manager: EntityManager): Promise<Condition[]> {
    try {
      const conditionRepository = manager.getRepository(Condition)

      const conditions = createConditionDtos.map(dto => conditionRepository.create(dto))

      return await conditionRepository.save(conditions)
    } catch (error) {
      throw error
    }
  }
}
