import { Injectable } from '@nestjs/common'
import { CreateTemplateColumnDto } from './dto/create-template_column.dto'
import { UpdateTemplateColumnDto } from './dto/update-template_column.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { TemplateColumn } from './entities/template_column.entity'
import { Repository } from 'typeorm'

@Injectable()
export class TemplateColumnsService {
  constructor(
    @InjectRepository(TemplateColumn) private readonly templateColumnRepository: Repository<TemplateColumn>,
  ) {}

  create(createTemplateColumnDto: CreateTemplateColumnDto) {
    return 'This action adds a new templateColumn'
  }

  async findByTemplateId(id: string) {
    return await this.templateColumnRepository.find({
      where: { templateId: id },
      select: ['id', 'name'],
    })
  }

  update(id: number, updateTemplateColumnDto: UpdateTemplateColumnDto) {
    return `This action updates a #${id} templateColumn`
  }

  remove(id: number) {
    return `This action removes a #${id} templateColumn`
  }
}
