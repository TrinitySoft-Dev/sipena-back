import { CreateConditionGroupDto } from '@/condition_groups/dto/create-condition_group.dto'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator'

export class CreateExtraRuleDto {
  @ApiProperty({
    name: 'name',
    description: 'Name of the extra rule',
    example: 'Extra weight',
  })
  @IsString()
  name: string

  @ApiProperty({
    name: 'rate',
    description: 'Rate of the extra rule',
    example: 10,
  })
  @IsNumber()
  rate: number

  @ApiProperty({
    name: 'rate_type',
    description: 'Rate of the extra rule',
    example: 'per_item',
  })
  @IsString()
  rate_type: string

  @ApiProperty({
    name: 'active',
    description: 'Indicates if the rule is active',
    example: true,
  })
  @IsBoolean()
  active: boolean

  @ApiProperty({
    name: 'rules',
    description: 'Rules of the extra rule',
    example: [{ id: 1 }],
  })
  @IsOptional()
  @IsArray()
  rules: Array<any>

  @ApiProperty({ description: 'Unit of the extra rule', example: 'sku' })
  @IsString()
  unit: string

  @ApiProperty({
    name: 'condition_groups',
    description: 'Condition groups of the extra rule',
    example: [
      {
        conditions: [
          {
            field: 'cartons',
            operator: '>=',
            value: '10',
          },
          {
            field: 'cartons',
            operator: '<=',
            value: '50',
          },
        ],
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateConditionGroupDto)
  condition_groups: CreateConditionGroupDto[]
}
