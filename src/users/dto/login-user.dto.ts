import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'

export class LoginUserDto {
  @ApiProperty({
    description: 'Email of the user',
    example: 'john@example.com',
    required: true,
  })
  @IsEmail()
  email: string

  @ApiProperty({
    description: 'Password of the user',
    example: '123456',
    required: true,
  })
  @IsString()
  password: string
}
