import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateRuleDto } from './dto/create-rule.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Rule } from './entities/rule.entity'
import { Repository } from 'typeorm'
import { RulesConditionsService } from '@/rules-conditions/rules-conditions.service'
import { UsersService } from '@/users/users.service'
import { User } from '@/users/entities/user.entity'

@Injectable()
export class RulesService {
  constructor(
    @InjectRepository(Rule) private readonly ruleRepository: Repository<Rule>,
    private readonly rulesConditionsService: RulesConditionsService,
    private readonly usersService: UsersService,
  ) {}

  async create(createRuleDto: CreateRuleDto) {
    const { conditions, customer, ...rest } = createRuleDto

    const customerUser = await this.usersService.findById(Number(customer))
    if (!customerUser) throw new BadRequestException('Invalid customer')

    const rule = await this.ruleRepository.save({ ...rest, customer: customerUser })
    const rulesConditions = await this.rulesConditionsService.createBatch(conditions, rule)

    rule.conditions = rulesConditions
    await this.ruleRepository.save(rule)

    return { message: 'Rule created successfully' }
  }

  async findByClient(client: number) {
    return await this.ruleRepository.find({
      where: { customer: { id: client, active: true } },
      relations: ['conditions'],
    })
  }
}
