import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateRulesConditionDto {
  @ApiProperty({
    description: 'Type of the condition',
    example: 'and',
    required: true,
  })
  @IsString()
  condition_type: string

  @ApiProperty({
    description: 'List of the conditions',
    example: [
      {
        field: 'name',
        operator: 'eq',
        value: 'john',
      },
      {
        field: 'age',
        operator: 'eq',
        value: '20',
      },
    ],
    required: true,
  })
  list: RulesConditions[]
}

class RulesConditions {
  @ApiProperty({
    description: 'Field of the condition',
    example: 'name',
    required: true,
  })
  @IsString()
  field: string

  @ApiProperty({
    description: 'Operator of the condition',
    example: 'eq',
    required: true,
  })
  @IsString()
  operator: string

  @ApiProperty({
    description: 'Value of the condition',
    example: 'john',
    required: true,
  })
  @IsString()
  value: string
}
