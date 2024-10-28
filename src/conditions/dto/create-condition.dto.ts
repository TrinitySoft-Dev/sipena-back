import { getAllowedConditionFieldsSimplify } from '@/common/decorators/allowed-fields.decorator'
import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsIn, IsInt, IsOptional, IsString } from 'class-validator'

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

  @ApiProperty({
    description: 'Id of the condition group',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  condition_group_id?: number

  @ApiProperty({
    description: 'Mandatory of the condition',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  mandatory: boolean

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
