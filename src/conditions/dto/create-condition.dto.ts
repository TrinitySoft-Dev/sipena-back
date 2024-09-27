import { getAllowedConditionFieldsSimplify } from '@/common/decorators/allowed-fields.decorator'
import { IsIn, IsString } from 'class-validator'

const ALLOWED_CONDITION_FIELDS = getAllowedConditionFieldsSimplify()

export class CreateConditionDto {
  @IsString()
  @IsIn(ALLOWED_CONDITION_FIELDS, {
    message: 'The field "$value" is not allowed',
  })
  field: string

  @IsString()
  operator: string

  @IsString()
  value: string
}
