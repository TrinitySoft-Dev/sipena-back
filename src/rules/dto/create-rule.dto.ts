import { CreateRulesConditionDto } from '@/rules-conditions/dto/create-rules-condition.dto'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsInt, IsNumber, IsString, ValidateNested } from 'class-validator'

const example = [
  {
    list: [
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
  },
  {
    list: [
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
  },
]

export class CreateRuleDto {
  @ApiProperty({
    description: 'Customer id of the rule',
    example: '1',
    required: true,
  })
  @IsString()
  customer: string

  @ApiProperty({
    description: 'container size of the rule',
    example: '10',
    required: true,
  })
  @IsInt()
  container_size: number

  @ApiProperty({
    description: 'Rate of the rule',
    example: '10',
    required: true,
  })
  @IsNumber()
  rate: number

  @ApiProperty({
    description: 'Conditions of the rule',
    example,
    required: true,
  })
  @IsArray()
  conditions: CreateRulesConditionDto[]
}
