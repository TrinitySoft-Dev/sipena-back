import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

export class CreateContainerSizeDto {
  @ApiProperty({
    description: 'Size of the container',
    example: 10,
  })
  @IsNumber()
  value: number
}
