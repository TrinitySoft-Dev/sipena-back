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

  async update(id: number, createContainerDto: CreateContainerDto) {
    const container = await this.containerRepository.findOne({ where: { id } })
    if (!container) {
      throw new NotFoundException('Container not found')
    }
    return await this.containerRepository.save({ ...container, ...createContainerDto })
  }

  async validateContainerNumber(containerNumber: string) {
    const container = await this.containerRepository.findOne({
      where: { container_number: containerNumber },
      select: ['container_number'],
    })
    return container
  }
}
