import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateUserDto {
  @ApiProperty({
    description: 'Id of the user',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  id?: number

  @ApiProperty({
    description: 'Email of the user',
    example: 'john@example.com',
  })
  @IsEmail()
  email: string

  @ApiProperty({
    description: 'Password of the user',
    example: '123456',
  })
  @IsOptional()
  @IsString()
  password: string

  @ApiProperty({
    description: 'Name of the user',
    example: 'John Doe',
  })
  @IsString()
  name: string

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
  })
  @IsString()
  last_name: string

  @ApiProperty({
    description: 'Phone of the user',
    example: '123456789',
  })
  @IsString()
  phone: string

  @ApiProperty({
    description: 'TFN of the user',
    example: '123456789',
  })
  @IsString()
  tfn: string

  @ApiProperty({
    description: 'ABN of the user',
    example: '123456789',
  })
  @IsString()
  abn: string

  @ApiProperty({
    description: 'Birthday of the user',
    example: '2000-01-01',
  })
  @IsString()
  birthday: string

  @ApiProperty({
    description: 'Employment end date of the user',
    example: '2000-01-01',
  })
  @IsString()
  employment_end_date: string

  @ApiProperty({
    description: 'Address of the user',
    example: '123456789',
  })
  @IsString()
  address: string

  @ApiProperty({
    description: 'City of the user',
    example: '123456789',
  })
  @IsString()
  city: string

  @ApiProperty({
    description: 'Bank name of the user',
    example: '123456789',
  })
  @IsString()
  bank_name: string

  @ApiProperty({
    description: 'Bank account name of the user',
    example: '123456789',
  })
  @IsString()
  bank_account_name: string

  @ApiProperty({
    description: 'Bank account number of the user',
    example: '123456789',
  })
  @IsString()
  bank_account_number: string

  @ApiProperty({
    description: 'BSB of the user',
    example: '123456789',
  })
  @IsString()
  bsb: string

  @ApiProperty({
    description: 'Create basic user',
    example: 'BASIC',
    enum: ['BASIC', 'FULL'],
  })
  @IsString()
  create_type: string
}
