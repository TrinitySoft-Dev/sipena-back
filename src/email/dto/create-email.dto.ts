import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateEmailDto {
  @ApiProperty({
    description: 'Template of the email',
    example: 'confirmation.html',
  })
  @IsString()
  template: string

  @ApiProperty({
    description: 'Email of the user',
    example: 'john@example.com',
  })
  @IsString()
  email: string
}
