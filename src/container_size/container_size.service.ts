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

  async find({ page, pageSize, includePagination }: { page: number; pageSize: number; includePagination: boolean }) {
    if (includePagination) {
      const [result, total] = await this.containerSizeRepository.findAndCount({
        skip: page * pageSize,
        take: pageSize,
        order: {
          created_at: 'DESC',
        },
      })

      return { result, pagination: { page, pageSize, total } }
    }
    return this.containerSizeRepository.find({
      order: {
        created_at: 'DESC',
      },
    })
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

  async delete(id: number) {
    return await this.containerSizeRepository.softDelete(id)
  }
}
