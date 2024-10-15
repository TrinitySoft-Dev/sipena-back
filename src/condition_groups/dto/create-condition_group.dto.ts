import { CreateConditionDto } from '@/conditions/dto/create-condition.dto'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsInt, IsNumber, IsOptional, ValidateNested } from 'class-validator'

export class CreateConditionGroupDto {
  @ApiProperty({
    description: 'Id of the condition group',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  id?: number

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateConditionDto)
  conditions: CreateConditionDto[]

  @ApiProperty({
    description: 'Id of the rule',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  rule_id?: number
}
