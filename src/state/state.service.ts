import { Injectable } from '@nestjs/common'
import { CreateStateDto } from './dto/create-state.dto'
import { UpdateStateDto } from './dto/update-state.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { State } from './entities/state.entity'
import { Repository } from 'typeorm'

@Injectable()
export class StateService {
  constructor(@InjectRepository(State) private readonly stateRepository: Repository<State>) {}

  create(createStateDto: CreateStateDto) {
    return this.stateRepository.save(createStateDto)
  }

  findAll() {
    return this.stateRepository
      .createQueryBuilder('state')
      .leftJoinAndSelect('state.cities', 'city')
      .select(['state.id', 'state.name', 'city.id', 'city.name'])
      .getMany()
  }
}
