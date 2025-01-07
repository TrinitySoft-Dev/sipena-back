import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator'

export class CreateNormalScheduleDto {
  @ApiProperty({
    type: String,
    description: 'The name of the normal schedule',
    example: 'Normal Schedule 1',
  })
  @IsString()
  name: string

  @ApiProperty({
    type: 'number',
    description: 'Work ID',
    example: 1,
  })
  @IsNumber()
  work: number

  @ApiProperty({
    description: 'Days of the week',
    example: ['Monday', 'Tuesday'],
  })
  @IsArray()
  @IsString({ each: true })
  days: string[]

  @ApiProperty({
    description: 'Hours worked',
    example: 8,
  })
  @IsNumber()
  rate: number

  @ApiProperty({
    description: 'Rate worker',
    example: 8,
  })
  @IsNumber()
  rate_worker: number

  @ApiProperty({
    description: 'Hours worked',
    example: 8,
  })
  @IsNumber()
  up_hours: number

  @ApiProperty({
    description: 'Overtimes',
    example: [1, 2],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  overtimes: number[]

  @ApiProperty({
    description: 'Active status',
    example: true,
  })
  @IsBoolean()
  active: boolean
}
