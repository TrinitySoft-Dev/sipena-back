import { Module } from '@nestjs/common'
import { ConditionGroupsService } from './condition_groups.service'
import { ConditionGroupsController } from './condition_groups.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConditionGroup } from './entities/condition_group.entity'
import { ConditionsModule } from '@/conditions/conditions.module'

@Module({
  imports: [TypeOrmModule.forFeature([ConditionGroup]), ConditionsModule],
  controllers: [ConditionGroupsController],
  providers: [ConditionGroupsService],
  exports: [ConditionGroupsService],
})
export class ConditionGroupsModule {}
