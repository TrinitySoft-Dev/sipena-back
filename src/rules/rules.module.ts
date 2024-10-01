import { Module } from '@nestjs/common'
import { RulesService } from './rules.service'
import { RulesController } from './rules.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Rule } from './entities/rule.entity'
import { ConditionGroupsModule } from '@/condition_groups/condition_groups.module'

@Module({
  imports: [TypeOrmModule.forFeature([Rule]), ConditionGroupsModule],
  controllers: [RulesController],
  providers: [RulesService],
  exports: [RulesService],
})
export class RulesModule {}
