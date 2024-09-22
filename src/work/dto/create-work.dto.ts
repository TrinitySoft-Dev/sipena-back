import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateWorkDto {
  @ApiProperty({
    description: 'Work name',
    example: 'General labor',
  })
  @IsString()
  name: string

  @ApiProperty({
    description: 'Work code',
    example: 'GL',
  })
  @IsString()
  code: string
}
