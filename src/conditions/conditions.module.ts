import { Module } from '@nestjs/common'
import { ConditionsService } from './conditions.service'
import { ConditionsController } from './conditions.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Condition } from './entities/condition.entity'
import { AccessJwtService } from '@/common/services/access-jwt.service'

@Module({
  imports: [TypeOrmModule.forFeature([Condition])],
  controllers: [ConditionsController],
  providers: [ConditionsService, AccessJwtService],
  exports: [ConditionsService],
})
export class ConditionsModule {}
