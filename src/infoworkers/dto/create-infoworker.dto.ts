import { IsBoolean, IsDateString, IsPhoneNumber, IsString } from 'class-validator'

export class CreateInfoworkerDto {
  @IsPhoneNumber()
  phone: string

  @IsString()
  tfn: string // Tax File Number: código fiscal de identificación de la persona física

  @IsString()
  abn: string

  @IsDateString()
  birthday: string

  @IsDateString()
  employment_end_date: string

  @IsString()
  passport: string

  @IsString()
  address: string

  @IsString()
  city: string

  @IsString()
  visa: string
}
