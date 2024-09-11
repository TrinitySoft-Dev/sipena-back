import { Module } from '@nestjs/common'
import { RulesConditionsService } from './rules-conditions.service'
import { RulesConditionsController } from './rules-conditions.controller'
import { RulesCondition } from './entities/rules-condition.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([RulesCondition])],
  controllers: [RulesConditionsController],
  providers: [RulesConditionsService],
  exports: [RulesConditionsService],
})
export class RulesConditionsModule {}
