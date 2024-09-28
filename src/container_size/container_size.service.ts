import { Injectable } from '@nestjs/common'
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

  findById(id: number) {
    return this.containerSizeRepository.findOne({ where: { id } })
  }
}
