import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsEmail, IsOptional } from 'class-validator'

export class CreateAdminEmailDto {
  @ApiProperty({
    example: 'rojasjhonatan324@gmail.com',
    description: 'The email of the admin',
  })
  @IsEmail()
  email: string

  @ApiProperty({
    example: true,
    description: 'The status of the admin',
  })
  @IsOptional()
  @IsBoolean()
  active: boolean
}
