import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token of the user',
    example: 'asidohnwqekl123',
  })
  @IsString()
  refreshToken: string
}