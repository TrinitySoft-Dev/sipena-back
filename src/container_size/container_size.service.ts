import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateContainerSizeDto } from './dto/create-container_size.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { ContainerSize } from './entities/container_size.entity'
import { Repository } from 'typeorm'

@Injectable()
export class ContainerSizeService {
  constructor(@InjectRepository(ContainerSize) private readonly containerSizeRepository: Repository<ContainerSize>) {}

  create(createContainerSizeDto: CreateContainerSizeDto) {
    return this.containerSizeRepository.save(createContainerSizeDto)
  }

  find() {
    return this.containerSizeRepository.find()
  }

  async findById(id: number) {
    const containerSize = await this.containerSizeRepository.findOne({ where: { id } })
    if (!containerSize) throw new NotFoundException('ContainerSize not found')
    return containerSize
  }

  async update(id: number, createContainerSizeDto: CreateContainerSizeDto) {
    const containerSize = await this.containerSizeRepository.findOne({ where: { id } })
    if (!containerSize) throw new NotFoundException('ContainerSize not found')
    Object.assign(containerSize, createContainerSizeDto)
    return this.containerSizeRepository.save(containerSize)
  }
}
