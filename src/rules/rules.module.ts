import { Module } from '@nestjs/common'
import { RulesService } from './rules.service'
import { RulesController } from './rules.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Rule } from './entities/rule.entity'
import { RulesConditionsModule } from '@/rules-conditions/rules-conditions.module'

@Module({
  imports: [TypeOrmModule.forFeature([Rule]), RulesConditionsModule],
  controllers: [RulesController],
  providers: [RulesService],
})
export class RulesModule {}
