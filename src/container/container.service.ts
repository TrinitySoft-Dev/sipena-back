import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateContainerDto } from './dto/create-container.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Container } from './entities/container.entity'
import { Repository } from 'typeorm'

@Injectable()
export class ContainerService {
  constructor(@InjectRepository(Container) private readonly containerRepository: Repository<Container>) {}

  async create(createContainerDto: CreateContainerDto) {
    return await this.containerRepository.save(createContainerDto)
  }
}
