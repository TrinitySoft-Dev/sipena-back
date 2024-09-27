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
      },
      {
        field: 'cartons',
        operator: '<=',
        value: '50',
      },
    ],
  },
  {
    conditions: [
      {
        field: 'skus',
        operator: '>=',
        value: '0',
      },
      {
        field: 'skus',
        operator: '<=',
        value: '50',
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
