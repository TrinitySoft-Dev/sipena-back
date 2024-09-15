import { IsString } from 'class-validator'

export class CreateConditionDto {
  @IsString()
  field: string

  @IsString()
  operator: string

  @IsString()
  value: string
}
