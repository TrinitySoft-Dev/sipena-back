import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateWorkDto } from './dto/create-work.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Work } from './entities/work.entity'
import { Repository } from 'typeorm'
import { UpdateWorkDto } from './dto/update-work.dto'
import { WorkFieldVisibility } from './entities/workFieldVisibility.entity'

@Injectable()
export class WorkService {
  constructor(
    @InjectRepository(Work) private readonly workRepository: Repository<Work>,
    @InjectRepository(WorkFieldVisibility)
    private readonly workFieldVisibilityRepository: Repository<WorkFieldVisibility>,
  ) {}

  async create(createWorkDto: CreateWorkDto) {
    const { name, code, fields } = createWorkDto

    const work = await this.workRepository.save({ name, code })

    const visibilities = fields.map(field => ({
      work,
      field: { id: Number(field.id) },
      isVisible: field.isVisible,
      position: field.position,
    }))

    await this.workFieldVisibilityRepository.save(visibilities)

    return this.findById(work.id)
  }

  async findById(id: number) {
    const work = await this.workRepository
      .createQueryBuilder('work')
      .leftJoinAndSelect('work.workFieldVisibilities', 'workFieldVisibilities')
      .leftJoinAndSelect('workFieldVisibilities.field', 'field')
      .where('work.id = :id', { id })
      .orderBy('workFieldVisibilities.position', 'ASC')
      .getOne()

    return work
  }

  async find() {
    return await this.workRepository.find({
      relations: ['workFieldVisibilities', 'workFieldVisibilities.field'],
      order: { id: 'ASC' },
    })
  }

  async update(id: number, updateWorkDto: UpdateWorkDto) {
    const { name, code, fields } = updateWorkDto

    const work = await this.workRepository.findOne({
      where: { id },
      relations: ['workFieldVisibilities'],
    })
    if (!work) throw new NotFoundException('Work not found')

    if (name !== undefined) work.name = name
    if (code !== undefined) work.code = code
    await this.workRepository.save(work)

    if (work.workFieldVisibilities && work.workFieldVisibilities.length > 0) {
      await this.workFieldVisibilityRepository.remove(work.workFieldVisibilities)
    }

    if (fields && fields.length > 0) {
      const newVisibilities = fields.map(field => ({
        work,
        field: { id: Number(field.id) },
        isVisible: Boolean(field.isVisible),
        position: field.position,
      }))
      await this.workFieldVisibilityRepository.save(newVisibilities)
    }

    return this.findById(work.id)
  }
}
