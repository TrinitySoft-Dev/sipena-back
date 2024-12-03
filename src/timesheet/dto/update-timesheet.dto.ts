import { PartialType } from '@nestjs/swagger'
import { CreateTimesheetDto } from './create-timesheet.dto'
import { IsOptional, IsString } from 'class-validator'

export class UpdateTimesheetDto extends PartialType(CreateTimesheetDto) {
  @IsOptional()
  @IsString()
  status: string
}
