import { Module } from '@nestjs/common'
import { OvertimesWorkerService } from './overtimes_worker.service'
import { OvertimesWorkerController } from './overtimes_worker.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OvertimesWorker } from './entities/overtimes_worker.entity'

@Module({
  imports: [TypeOrmModule.forFeature([OvertimesWorker]), OvertimesWorkerModule],
  controllers: [OvertimesWorkerController],
  providers: [OvertimesWorkerService],
  exports: [OvertimesWorkerService],
})
export class OvertimesWorkerModule {}
