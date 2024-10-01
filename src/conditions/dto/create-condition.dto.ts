import { getAllowedConditionFieldsSimplify } from '@/common/decorators/allowed-fields.decorator'
import { ApiProperty } from '@nestjs/swagger'
import { IsIn, IsInt, IsOptional, IsString } from 'class-validator'

const ALLOWED_CONDITION_FIELDS = getAllowedConditionFieldsSimplify()

export class CreateConditionDto {
  @ApiProperty({
    description: 'Id of the condition',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  id?: number

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
