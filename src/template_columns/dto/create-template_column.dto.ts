import getSelectedFieldsPaths from '@/common/helpers/getSelectFieldsPaths'
import { Timesheet } from '@/timesheet/entities/timesheet.entity'
import { ApiProperty } from '@nestjs/swagger'
import { IsIn, IsOptional, IsString } from 'class-validator'

const TEMPLATE_PATHS = getSelectedFieldsPaths(Timesheet)

export class CreateTemplateColumnDto {
  @ApiProperty({
    type: 'string',
    description: 'The name of the template_column',
  })
  @IsString()
  name: string

  @ApiProperty({
    type: 'string',
    description: 'The select_field of the template_column',
  })
  @IsOptional()
  @IsString()
  default_value: string

  @ApiProperty({
    type: 'string',
    description: 'The select_field of the template_column',
  })
  @IsIn(TEMPLATE_PATHS)
  @IsOptional()
  @IsString()
  select_field: string
}
