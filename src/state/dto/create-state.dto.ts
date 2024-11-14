import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateStateDto {
  @ApiProperty({
    example: 'New York',
    description: 'The name of the state',
    required: true,
  })
  @IsString()
  name: string
}
