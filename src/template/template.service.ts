import { Injectable } from '@nestjs/common'
import { CreateTemplateDto } from './dto/create-template.dto'
import getSelectedFieldsWithPaths from '@/common/helpers/getAllSelectedFields'
import { Timesheet } from '@/timesheet/entities/timesheet.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Template } from './entities/template.entity'
import { Repository } from 'typeorm'

@Injectable()
export class TemplateService {
  constructor(@InjectRepository(Template) private readonly templateRepository: Repository<Template>) {}

  create(createTemplateDto: CreateTemplateDto) {
    return this.templateRepository.save(createTemplateDto)
  }

  fields() {
    return getSelectedFieldsWithPaths(Timesheet)
  }
}
