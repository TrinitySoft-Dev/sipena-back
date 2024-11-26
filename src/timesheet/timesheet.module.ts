import { Module } from '@nestjs/common'
import { TimesheetService } from './timesheet.service'
import { TimesheetController } from './timesheet.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Timesheet } from './entities/timesheet.entity'
import { ContainerModule } from '@/container/container.module'
import { UsersModule } from '@/users/users.module'
import { ConditionsModule } from '@/conditions/conditions.module'
import { TimesheetWorkersModule } from '@/timesheet_workers/timesheet_workers.module'
import { AccessJwtService } from '@/common/services/access-jwt.service'
import { ContainerSizeModule } from '@/container_size/container_size.module'
import { RulesWorkersModule } from '@/rules_workers/rules_workers.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Timesheet]),
    ContainerModule,
    UsersModule,
    ConditionsModule,
    TimesheetWorkersModule,
    ContainerSizeModule,
    RulesWorkersModule,
  ],
  controllers: [TimesheetController],
  providers: [TimesheetService, AccessJwtService],
})
export class TimesheetModule {}
