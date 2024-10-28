import { CreateConditionGroupDto } from '@/condition_groups/dto/create-condition_group.dto'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsBoolean, IsNumber, IsString, ValidateNested } from 'class-validator'

export class CreateExtraRuleDto {
  @ApiProperty({
    name: 'name',
    description: 'Name of the extra rule',
    example: 'Extra weight',
  })
  @IsString()
  name: string

  @ApiProperty({
    name: 'status',
    description: 'Status of the extra rule',
    example: true,
  })
  @IsBoolean()
  status: boolean

  @ApiProperty({
    name: 'rate',
    description: 'Rate of the extra rule',
    example: 10,
  })
  @IsNumber()
  rate: number

  @ApiProperty({
    name: 'rate_type',
    description: 'Type of the extra rule',
    example: 'fixed',
  })
  @IsString()
  rate_type: string

  @ApiProperty({
    name: 'unit',
    description: 'Unit of the extra rule',
    example: 'sku',
  })
  @IsString()
  unit: string

  @ApiProperty({
    name: 'limit',
    description: 'Limit of the extra rule',
    example: 10,
  })
  @IsNumber()
  limit: number

  @ApiProperty({
    name: 'condition_groups',
    description: 'Condition groups of the extra rule',
    example: [
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
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateConditionGroupDto)
  condition_groups: CreateConditionGroupDto[]
}
