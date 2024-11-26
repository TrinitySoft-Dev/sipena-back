import { Module } from '@nestjs/common'
import { RulesWorkersService } from './rules_workers.service'
import { RulesWorkersController } from './rules_workers.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RulesWorker } from './entities/rules_worker.entity'
import { ConditionsModule } from '@/conditions/conditions.module'

@Module({
  imports: [TypeOrmModule.forFeature([RulesWorker]), ConditionsModule],
  controllers: [RulesWorkersController],
  providers: [RulesWorkersService],
  exports: [RulesWorkersService],
})
export class RulesWorkersModule {}
