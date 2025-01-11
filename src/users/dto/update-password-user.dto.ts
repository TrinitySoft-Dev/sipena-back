import { IsString, MinLength } from 'class-validator'

export class UpdatePasswordDto {
  @IsString()
  oldPassword: string

  @IsString()
  @MinLength(8, { message: 'The new password must be at least 8 characters long' })
  newPassword: string
}
