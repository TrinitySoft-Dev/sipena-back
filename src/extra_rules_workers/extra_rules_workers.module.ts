import { Module } from '@nestjs/common'
import { ExtraRulesWorkersService } from './extra_rules_workers.service'
import { ExtraRulesWorkersController } from './extra_rules_workers.controller'
import { ExtraRulesWorker } from './entities/extra_rules_worker.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([ExtraRulesWorker])],
  controllers: [ExtraRulesWorkersController],
  providers: [ExtraRulesWorkersService],
})
export class ExtraRulesWorkersModule {}
