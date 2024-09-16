import { CreateConditionDto } from '@/conditions/dto/create-condition.dto'
import { Type } from 'class-transformer'
import { IsArray, ValidateNested } from 'class-validator'

export class CreateConditionGroupDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateConditionDto)
  conditions: CreateConditionDto[]
}
