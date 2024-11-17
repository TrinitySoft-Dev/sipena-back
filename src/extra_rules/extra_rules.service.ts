import { Injectable } from '@nestjs/common'
import { CreateExtraRuleDto } from './dto/create-extra_rule.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { ExtraRule } from './entities/extra_rule.entity'
import { Repository } from 'typeorm'
import { UpdateExtraRuleDto } from './dto/update-extra_rule.dto'

@Injectable()
export class ExtraRulesService {
  constructor(@InjectRepository(ExtraRule) private readonly extraRuleRepository: Repository<ExtraRule>) {}

  async create(createExtraRuleDto: CreateExtraRuleDto) {
    return await this.extraRuleRepository.save(createExtraRuleDto)
  }

  async findAll({ page, pageSize, includePagination }: { page: number; pageSize: number; includePagination: boolean }) {
    if (includePagination) {
      const [result, total] = await this.extraRuleRepository.findAndCount({
        skip: page * pageSize,
        take: pageSize,
        order: {
          created_at: 'DESC',
        },
      })

      return { result, pagination: { page, pageSize, total } }
    }

    return await this.extraRuleRepository.find({
      order: {
        created_at: 'DESC',
      },
    })
  }

  async findByRuleId(id: number) {
    return await this.extraRuleRepository.find({ where: { rules: { id } } })
  }

  async update(id: number, updateExtraRuleDto: UpdateExtraRuleDto) {}
}
