import { CreateConditionGroupDto } from '@/condition_groups/dto/create-condition_group.dto'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsBoolean, IsNumber, IsString, ValidateNested } from 'class-validator'

export class CreateExtraRulesWorkerDto {
  @ApiProperty({
    type: 'string',
    description: 'The name of the extra rules worker',
    example: 'Extra rules worker 1',
  })
  @IsString()
  name: string

  @ApiProperty({
    type: 'number',
    description: 'The rate of the extra rules worker',
    example: 10.5,
  })
  @IsNumber()
  rate: number

  @ApiProperty({
    type: 'string',
    description: 'The rate type of the extra rules worker',
    example: 'hour',
  })
  @IsString()
  rate_type: string

  @ApiProperty({
    type: 'string',
    description: 'The payment type of the extra rules worker',
    example: 'cash',
  })
  @IsString()
  payment_type: string

  @ApiProperty({
    description: 'Condition groups of the rules_worker',
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

  @ApiProperty({
    type: 'boolean',
    description: 'The active of the extra rules worker',
  })
  @IsBoolean()
  active: boolean
}
