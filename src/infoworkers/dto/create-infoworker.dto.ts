import { IsDateString, IsOptional, IsPhoneNumber, IsString } from 'class-validator'

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
  city: string

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
