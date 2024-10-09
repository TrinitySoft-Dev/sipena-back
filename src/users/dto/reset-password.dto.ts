import { ApiProperty } from '@nestjs/swagger'
import { IsString, MinLength } from 'class-validator'

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Token of the user',
    example: 'asidohnwqekl123',
  })
  @IsString()
  token: string

  @ApiProperty({
    description: 'New password of the user',
    example: '123456',
  })
  @IsString()
  @MinLength(6)
  newPassword: string
}
