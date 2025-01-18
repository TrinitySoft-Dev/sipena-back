import { Module } from '@nestjs/common'
import { ExtraRulesWorkersService } from './extra_rules_workers.service'
import { ExtraRulesWorkersController } from './extra_rules_workers.controller'
import { ExtraRulesWorker } from './entities/extra_rules_worker.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConditionsModule } from '@/conditions/conditions.module'
import { AccessJwtService } from '@/common/services/access-jwt.service'

@Module({
  imports: [TypeOrmModule.forFeature([ExtraRulesWorker]), ConditionsModule],
  controllers: [ExtraRulesWorkersController],
  providers: [ExtraRulesWorkersService, AccessJwtService],
  exports: [ExtraRulesWorkersService],
})
export class ExtraRulesWorkersModule {}
