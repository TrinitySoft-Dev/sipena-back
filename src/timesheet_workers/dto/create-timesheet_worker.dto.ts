import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateTimesheetWorkerDto {
  @ApiProperty({
    description: 'Worker id of the timesheet',
    example: 1,
  })
  @IsNumber()
  worker: number

  @ApiProperty({
    description: 'Timesheet id of the timesheet',
    example: 1,
  })
  @IsNumber()
  timesheet: number

  @ApiProperty({
    description: 'Break of the timesheet',
    example: '2021-01-01',
    required: true,
  })
  @IsDateString()
  break: Date

  @ApiProperty({
    description: 'Waiting time of the timesheet',
    example: '2021-01-01',
    required: true,
  })
  @IsDateString()
  waiting_time: Date

  @ApiProperty({
    description: 'Time of the timesheet',
    example: '2021-01-01',
    required: true,
  })
  @IsDateString()
  time: Date

  @ApiProperty({
    description: 'Time out of the timesheet',
    example: '2021-01-01',
  })
  @IsDateString()
  time_out: Date

  @ApiProperty({
    description: 'Comment of the timesheet',
    example: 'Comment',
  })
  @IsOptional()
  @IsString()
  comment: string
}
