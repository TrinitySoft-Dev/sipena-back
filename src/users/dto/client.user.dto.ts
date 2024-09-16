import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsEmail, IsString } from 'class-validator'

export class ClientUserDto {
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

  @ApiProperty({
    description: 'Name of the user',
    example: 'John Doe',
    required: true,
  })
  @IsString()
  name: string

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
    required: true,
  })
  @IsString()
  last_name: string

  @ApiProperty({
    description: 'Phone of the user',
    example: '123456789',
    required: true,
  })
  @IsString()
  phone: string

  @ApiProperty({
    description: 'Role of the user',
    example: 'CLIENT',
    required: true,
  })
  @IsString()
  role: string

  @ApiProperty({
    description: 'Rules of the user',
    example: '[1,2,3,4]',
  })
  @IsArray()
  rules: number[]
}
