import { Module } from '@nestjs/common'
import { NormalScheduleService } from './normal_schedule.service'
import { NormalScheduleController } from './normal_schedule.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { NormalSchedule } from './entities/normal_schedule.entity'

@Module({
  imports: [TypeOrmModule.forFeature([NormalSchedule])],
  controllers: [NormalScheduleController],
  providers: [NormalScheduleService],
})
export class NormalScheduleModule {}
