import { Module } from '@nestjs/common'
import { OvertimesWorkerService } from './overtimes_worker.service'
import { OvertimesWorkerController } from './overtimes_worker.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OvertimesWorker } from './entities/overtimes_worker.entity'
import { AccessJwtService } from '@/common/services/access-jwt.service'

@Module({
  imports: [TypeOrmModule.forFeature([OvertimesWorker]), OvertimesWorkerModule],
  controllers: [OvertimesWorkerController],
  providers: [OvertimesWorkerService, AccessJwtService],
  exports: [OvertimesWorkerService],
})
export class OvertimesWorkerModule {}
