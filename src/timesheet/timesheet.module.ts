import { Module } from '@nestjs/common'
import { TimesheetService } from './timesheet.service'
import { TimesheetController } from './timesheet.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Timesheet } from './entities/timesheet.entity'
import { ContainerModule } from '@/container/container.module'
import { UsersModule } from '@/users/users.module'
import { RulesModule } from '@/rules/rules.module'

@Module({
  imports: [TypeOrmModule.forFeature([Timesheet]), ContainerModule, UsersModule, RulesModule],
  controllers: [TimesheetController],
  providers: [TimesheetService],
})
export class TimesheetModule {}
