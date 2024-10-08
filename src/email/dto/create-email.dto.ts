import { ApiProperty } from '@nestjs/swagger'
import { IsObject, IsOptional, IsString } from 'class-validator'

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

  @ApiProperty({
    description: 'Data of the email',
    example: {
      name: 'John Doe',
      last_name: 'Doe',
      email: 'john@example.com',
    },
  })
  @IsObject()
  data: any
}
