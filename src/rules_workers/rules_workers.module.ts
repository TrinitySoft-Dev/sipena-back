import { Module } from '@nestjs/common'
import { RulesWorkersService } from './rules_workers.service'
import { RulesWorkersController } from './rules_workers.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RulesWorker } from './entities/rules_worker.entity'
import { ConditionsModule } from '@/conditions/conditions.module'
import { WorkModule } from '@/work/work.module'
import { ContainerSizeModule } from '@/container_size/container_size.module'
import { ExtraRulesWorkersModule } from '@/extra_rules_workers/extra_rules_workers.module'
import { AccessJwtService } from '@/common/services/access-jwt.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([RulesWorker]),
    ConditionsModule,
    ConditionsModule,
    WorkModule,
    ContainerSizeModule,
    ExtraRulesWorkersModule,
  ],
  controllers: [RulesWorkersController],
  providers: [RulesWorkersService, AccessJwtService],
  exports: [RulesWorkersService],
})
export class RulesWorkersModule {}
