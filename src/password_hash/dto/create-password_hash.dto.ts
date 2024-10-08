import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsNumber, IsString } from 'class-validator'

export class CreatePasswordHashDto {
  @ApiProperty({
    description: 'token of the user',
    example: 'asidohnwqekl123',
  })
  @IsString()
  token: string

  @ApiProperty({
    description: 'userId of the user',
    example: 1,
  })
  @IsNumber()
  userId: number

  @ApiProperty({
    description: 'password of the user',
    example: '123456',
  })
  @IsDateString()
  expires: Date
}
