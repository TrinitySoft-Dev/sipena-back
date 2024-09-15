import { CreateConditionGroupDto } from '@/condition_groups/dto/create-condition_group.dto'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsInt, IsNumber, IsString, ValidateNested } from 'class-validator'

const example = [
  {
    conditions: [
      {
        field: 'price',
        operator: '>=',
        value: '20',
      },
      {
        field: 'price',
        operator: '<=',
        value: '50',
      },
    ],
  },
  {
    conditions: [
      {
        field: 'price',
        operator: '>',
        value: '100',
      },
      {
        field: 'price',
        operator: '<',
        value: '150',
      },
    ],
  },
  {
    conditions: [
      {
        field: 'price',
        operator: '>',
        value: '170',
      },
      {
        field: 'price',
        operator: '<',
        value: '200',
      },
    ],
  },
]

export class CreateRuleDto {
  @ApiProperty({
    description: 'Customer id of the rule',
    example: 1,
    required: true,
  })
  @IsNumber()
  customer_id: number

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
  @ValidateNested({ each: true })
  @Type(() => CreateConditionGroupDto)
  condition_groups: CreateConditionGroupDto[]
}
