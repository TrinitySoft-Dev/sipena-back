import { Module } from '@nestjs/common';
import { RulesWorkersService } from './rules_workers.service';
import { RulesWorkersController } from './rules_workers.controller';

@Module({
  controllers: [RulesWorkersController],
  providers: [RulesWorkersService],
})
export class RulesWorkersModule {}
