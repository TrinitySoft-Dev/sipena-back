import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class CreateOvertimeDto {
  @ApiProperty({
    type: String,
    description: 'The name of the overtime',
    example: 'Overtime 1',
  })
  @IsString()
  name: string

  @ApiProperty({
    type: Number,
    description: 'The number of the overtime',
    example: 1,
  })
  @IsNumber()
  number: number

  @ApiProperty({
    type: Number,
    description: 'The hours of the overtime',
    example: 1,
  })
  @IsNumber()
  hours: number

  @ApiProperty({
    type: Number,
    description: 'The rate of the overtime',
    example: 1,
  })
  @IsNumber()
  rate: number
}
