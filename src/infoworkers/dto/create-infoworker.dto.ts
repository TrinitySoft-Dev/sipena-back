import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDateString, IsOptional, IsPhoneNumber, IsString, IsUUID, ValidateNested } from 'class-validator'

class CityDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p',
    description: 'The UUID of the city',
  })
  @IsUUID()
  id: string
}

export class CreateInfoworkerDto {
  @IsOptional()
  @IsPhoneNumber()
  phone: string

  @IsOptional()
  @IsString()
  tfn: string

  @IsOptional()
  @IsString()
  abn: string

  @IsOptional()
  @IsDateString()
  birthday: string

  @IsOptional()
  @IsDateString()
  employment_end_date: string

  @IsOptional()
  @IsString()
  passport: string

  @IsOptional()
  @IsString()
  address: string

  @IsOptional()
  @IsString()
  visa: string

  @IsOptional()
  @IsString()
  bank_name: string

  @IsOptional()
  @IsString()
  bank_account_name: string

  @IsOptional()
  @IsString()
  bank_account_number: string

  @IsOptional()
  @IsString()
  bsb: string
}
