import { CreateConditionGroupDto } from '@/condition_groups/dto/create-condition_group.dto'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsBoolean, IsInt, IsNumber, IsString, ValidateNested } from 'class-validator'

const example = [
  {
    conditions: [
      {
        field: 'cartons',
        operator: '>=',
        value: '=',
        mandatory: true,
      },
      {
        field: 'cartons',
        operator: '<=',
        value: '50',
        mandatory: true,
      },
    ],
  },
  {
    conditions: [
      {
        field: 'skus',
        operator: '>=',
        value: '0',
        mandatory: true,
      },
      {
        field: 'skus',
        operator: '<=',
        value: '50',
        mandatory: true,
      },
    ],
  },
]

export class CreateRuleDto {
  @ApiProperty({
    description: 'Work id of the rule',
    example: 1,
    required: true,
  })
  @IsNumber()
  work_id: number

  @ApiProperty({
    description: 'container size of the rule',
    example: '10',
    required: true,
  })
  @IsInt()
  container_size: number

  @ApiProperty({
    description: 'Name of the rule',
    example: 'Extra weight',
  })
  @IsString()
  name: string

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

  @ApiProperty({
    description: 'Status of the rule',
    example: true,
  })
  @IsBoolean()
  status: boolean
}
