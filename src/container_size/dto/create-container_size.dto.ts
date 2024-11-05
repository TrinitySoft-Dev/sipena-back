import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNumber } from 'class-validator'

export class CreateContainerSizeDto {
  @ApiProperty({
    description: 'Size of the container',
    example: 10,
  })
  @IsNumber()
  value: number

  @ApiProperty({
    description: 'Active',
    example: true,
  })
  @IsBoolean()
  active: boolean
}
