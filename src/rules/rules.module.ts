import { Module } from '@nestjs/common'
import { RulesService } from './rules.service'
import { RulesController } from './rules.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Rule } from './entities/rule.entity'
import { ConditionGroupsModule } from '@/condition_groups/condition_groups.module'
import { User } from '@/users/entities/user.entity'
import { WorkModule } from '@/work/work.module'
import { ContainerSizeModule } from '@/container_size/container_size.module'
import { AccessJwtService } from '@/common/services/access-jwt.service'

@Module({
  imports: [TypeOrmModule.forFeature([Rule, User]), ConditionGroupsModule, WorkModule, ContainerSizeModule],
  controllers: [RulesController],
  providers: [RulesService, AccessJwtService],
  exports: [RulesService],
})
export class RulesModule {}
