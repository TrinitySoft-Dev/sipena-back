import { PartialType } from '@nestjs/swagger'
import { CreateTimesheetWorkerDto } from './create-timesheet_worker.dto'
import { IsNumber } from 'class-validator'

export class UpdateTimesheetWorkerDto extends PartialType(CreateTimesheetWorkerDto) {
  @IsNumber()
  id: number
}
