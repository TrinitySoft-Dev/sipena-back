import { Module } from '@nestjs/common'
import { NormalScheduleService } from './normal_schedule.service'
import { NormalScheduleController } from './normal_schedule.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { NormalSchedule } from './entities/normal_schedule.entity'
import { OvertimesModule } from '@/overtimes/overtimes.module'

@Module({
  imports: [TypeOrmModule.forFeature([NormalSchedule]), OvertimesModule],
  controllers: [NormalScheduleController],
  providers: [NormalScheduleService],
  exports: [NormalScheduleService],
})
export class NormalScheduleModule {}
