import { forwardRef, Module } from '@nestjs/common'
import { RulesService } from './rules.service'
import { RulesController } from './rules.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Rule } from './entities/rule.entity'
import { UsersModule } from '@/users/users.module'
import { ConditionGroupsModule } from '@/condition_groups/condition_groups.module'
import { WorkModule } from '@/work/work.module'

@Module({
  imports: [TypeOrmModule.forFeature([Rule]), ConditionGroupsModule, WorkModule],
  controllers: [RulesController],
  providers: [RulesService],
  exports: [RulesService],
})
export class RulesModule {}
