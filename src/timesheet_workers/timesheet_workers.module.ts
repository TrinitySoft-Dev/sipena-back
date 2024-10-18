import { Module } from '@nestjs/common'
import { TimesheetWorkersService } from './timesheet_workers.service'
import { TimesheetWorkersController } from './timesheet_workers.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TimesheetWorker } from './entities/timesheet_worker.entity'

@Module({
  imports: [TypeOrmModule.forFeature([TimesheetWorker])],
  controllers: [TimesheetWorkersController],
  providers: [TimesheetWorkersService],
  exports: [TimesheetWorkersService],
})
export class TimesheetWorkersModule {}
