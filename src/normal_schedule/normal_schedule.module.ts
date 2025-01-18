import { Module } from '@nestjs/common'
import { NormalScheduleService } from './normal_schedule.service'
import { NormalScheduleController } from './normal_schedule.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { NormalSchedule } from './entities/normal_schedule.entity'
import { OvertimesModule } from '@/overtimes/overtimes.module'
import { OvertimesWorkerModule } from '@/overtimes_worker/overtimes_worker.module'
import { AccessJwtService } from '@/common/services/access-jwt.service'

@Module({
  imports: [TypeOrmModule.forFeature([NormalSchedule]), OvertimesModule, OvertimesWorkerModule],
  controllers: [NormalScheduleController],
  providers: [NormalScheduleService, AccessJwtService],
  exports: [NormalScheduleService],
})
export class NormalScheduleModule {}
