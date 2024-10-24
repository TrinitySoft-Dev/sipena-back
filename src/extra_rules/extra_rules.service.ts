import { Injectable } from '@nestjs/common'
import { CreateExtraRuleDto } from './dto/create-extra_rule.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { ExtraRule } from './entities/extra_rule.entity'
import { Repository } from 'typeorm'

@Injectable()
export class ExtraRulesService {
  constructor(@InjectRepository(ExtraRule) private readonly extraRuleRepository: Repository<ExtraRule>) {}

  async create(createExtraRuleDto: CreateExtraRuleDto) {
    return await this.extraRuleRepository.save(createExtraRuleDto)
  }
}
