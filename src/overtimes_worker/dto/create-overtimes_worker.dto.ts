import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class CreateOvertimesWorkerDto {
  @ApiProperty({
    description: 'The name of the overtime worker',
    example: 'John Doe',
  })
  @IsString()
  name: string

  @ApiProperty({
    description: 'The rate of the overtime worker',
    example: 200,
  })
  @IsNumber()
  rate: number

  @ApiProperty({
    description: 'The number of hours worked by the worker',
    example: 8,
  })
  @IsNumber()
  hours: number

  @ApiProperty({
    description: 'The number of overtime hours worked by the worker',
    example: 10,
  })
  @IsNumber()
  overtime_number: number
}
