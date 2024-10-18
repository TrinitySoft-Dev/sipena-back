import { Module } from '@nestjs/common'
import { TimesheetService } from './timesheet.service'
import { TimesheetController } from './timesheet.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Timesheet } from './entities/timesheet.entity'
import { ContainerModule } from '@/container/container.module'
import { UsersModule } from '@/users/users.module'
import { RulesModule } from '@/rules/rules.module'
import { ConditionsModule } from '@/conditions/conditions.module'
import { TimesheetWorkersModule } from '@/timesheet_workers/timesheet_workers.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Timesheet]),
    ContainerModule,
    UsersModule,
    ConditionsModule,
    TimesheetWorkersModule,
  ],
  controllers: [TimesheetController],
  providers: [TimesheetService],
})
export class TimesheetModule {}
