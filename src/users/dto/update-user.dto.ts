import { CreateInfoworkerDto } from '@/infoworkers/dto/create-infoworker.dto'
import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsEmail, IsOptional, IsString } from 'class-validator'

export class UpdateUserDto {
  @ApiProperty({
    description: 'Email of the user',
    example: 'john@example.com',
    required: true,
  })
  @IsOptional()
  @IsEmail()
  email: string

  @ApiProperty({
    description: 'Name of the user',
    example: 'John Doe',
    required: true,
  })
  @IsOptional()
  @IsString()
  name: string

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
    required: true,
  })
  @IsOptional()
  @IsString()
  last_name: string

  @ApiProperty({
    description: 'Phone of the user',
    example: '123456789',
    required: true,
  })
  @IsOptional()
  @IsString()
  phone: string

  @ApiProperty({
    description: 'Avatar of the user',
    example: 'https://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsString()
  avatar: string

  @ApiProperty({
    description: 'City of the user',
    example: 'City',
  })
  @IsOptional()
  @IsString()
  city: string

  @ApiProperty({
    description: 'Role of the user',
    example: 'CUSTOMER',
    required: true,
  })
  @IsOptional()
  @IsString()
  role: string

  @ApiProperty({
    description: 'Rules of the user',
    example: [{ id: 1 }],
  })
  @IsOptional()
  @IsArray()
  rules: number[]

  @ApiProperty({
    description: 'Visa of the user',
    example: '123456789',
  })
  @IsOptional()
  @IsString()
  passport: string

  @ApiProperty({
    description: 'Passport of the user',
    example: '123456789',
  })
  @IsOptional()
  @IsString()
  visa: string

  @ApiProperty({
    description: 'Extra rules of the user',
    example: [{ id: 1 }],
  })
  @IsOptional()
  @IsArray()
  extra_rules: number[]

  @ApiProperty({
    description: 'Normal schedule of the user',
    example: [{ id: 1 }],
  })
  @IsOptional()
  @IsArray()
  normal_schedule: number[]

  @ApiProperty({
    description: 'Information worker of the user',
    example: {
      phone: '123456789',
      tfn: '123456789',
      abn: '123456789',
      birthday: '2000-01-01',
      employment_end_date: '2000-01-01',
      passport: '123456789',
      address: '123456789',
      city: '123456789',
      visa: '123456789',
      bank_name: '123456789',
      bank_account_name: '123456789',
      bank_account_number: '123456789',
      bsb: '123456789',
      passport_url: '123456789',
      visa_url: '123456789',
    },
  })
  @IsOptional()
  infoworker: CreateInfoworkerDto
}
