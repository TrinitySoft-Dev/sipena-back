import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsPhoneNumber, IsString } from 'class-validator'

export class CreateUserDto {
  @ApiProperty({
    description: 'Email of the user',
    example: 'john@example.com',
    required: true,
    type: String,
    maxLength: 255,
    minLength: 5,
    default: 'john@example.com',
    nullable: false,
  })
  @IsEmail()
  email: string

  @ApiProperty({
    description: 'Password of the user',
    example: '123456',
    required: true,
    type: String,
    maxLength: 255,
    minLength: 5,
    default: '123456',
    nullable: false,
  })
  @IsString()
  password: string

  @ApiProperty({
    description: 'Name of the user',
    example: 'John Doe',
    required: true,
    type: String,
    maxLength: 255,
    minLength: 5,
    default: 'John Doe',
    nullable: false,
  })
  @IsString()
  name: string

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
    required: true,
    type: String,
    maxLength: 255,
    minLength: 5,
    default: 'Doe',
    nullable: false,
  })
  @IsString()
  last_name: string

  @ApiProperty({
    description: 'Phone of the user',
    example: '123456789',
    required: true,
    type: String,
    maxLength: 255,
    minLength: 5,
    default: '123456789',
    nullable: false,
  })
  @IsString()
  phone: string

  @ApiProperty({
    description: 'TFN of the user',
    example: '123456789',
    required: true,
    type: String,
    maxLength: 255,
    minLength: 5,
    default: '123456789',
    nullable: false,
  })
  @IsString()
  tfn: string

  @ApiProperty({
    description: 'ABN of the user',
    example: '123456789',
    required: true,
    type: String,
    maxLength: 255,
    minLength: 5,
    default: '123456789',
    nullable: false,
  })
  @IsString()
  abn: string

  @ApiProperty({
    description: 'Birthday of the user',
    example: '2000-01-01',
    required: true,
    type: String,
    maxLength: 255,
    minLength: 5,
    default: '2000-01-01',
    nullable: false,
  })
  @IsString()
  birthday: string

  @ApiProperty({
    description: 'Employment end date of the user',
    example: '2000-01-01',
    required: true,
    type: String,
    maxLength: 255,
    minLength: 5,
    default: '2000-01-01',
    nullable: false,
  })
  @IsString()
  employment_end_date: string

  @ApiProperty({
    description: 'Passport of the user',
    example: '123456789',
    required: true,
    type: String,
    maxLength: 255,
    minLength: 5,
    default: '123456789',
    nullable: false,
  })
  @IsString()
  passport: string

  @ApiProperty({
    description: 'Address of the user',
    example: '123456789',
    required: true,
    type: String,
    maxLength: 255,
    minLength: 5,
    default: '123456789',
    nullable: false,
  })
  @IsString()
  address: string

  @ApiProperty({
    description: 'City of the user',
    example: '123456789',
    required: true,
    type: String,
    maxLength: 255,
    minLength: 5,
    default: '123456789',
    nullable: false,
  })
  @IsString()
  city: string

  @ApiProperty({
    description: 'Visa of the user',
    example: '123456789',
    required: true,
    type: String,
    maxLength: 255,
    minLength: 5,
    default: '123456789',
    nullable: false,
  })
  @IsString()
  visa: string

  @ApiProperty({
    description: 'Role of the user',
    example: '123456789',
    required: true,
    type: String,
    maxLength: 255,
    minLength: 5,
    default: '123456789',
    nullable: false,
  })
  @IsString()
  role: string
}
