import { CreateConditionGroupDto } from '@/condition_groups/dto/create-condition_group.dto'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator'

export class CreateRulesWorkerDto {
  @ApiProperty({
    description: 'Name of the rules_worker',
    example: 'John Doe',
  })
  @IsString()
  name: string

  @ApiProperty({
    description: 'Rate of the rules_worker',
    example: 4,
  })
  @IsNumber()
  container_size: number

  @ApiProperty({
    description: 'Rate of the rules_worker',
    example: 4,
  })
  @IsNumber()
  rate: number

  @ApiProperty({
    description: 'Rate type of the rules_worker',
    example: 'hour',
  })
  @IsString()
  rate_type: string

  @ApiProperty({
    description: 'Work of the rules_worker',
    example: 'Work',
  })
  @IsString()
  work: number

  @ApiProperty({
    description: 'Payment type of the rules_worker',
    example: 'group',
  })
  payment_type: string

  @ApiProperty({
    description: 'Active of the rules_worker',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  active: boolean

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
}
