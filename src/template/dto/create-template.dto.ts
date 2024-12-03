import { CreateTemplateColumnDto } from '@/template_columns/dto/create-template_column.dto'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsString, ValidateNested } from 'class-validator'

export class CreateTemplateDto {
  @ApiProperty({
    type: 'string',
    description: 'The name of the template',
    example: 'Template 1',
  })
  @IsString()
  name: string

  @ApiProperty({
    type: [CreateTemplateColumnDto],
    description: 'The columns of the template',
    example: [
      {
        name: 'Column 1',
        default_value: 'Default value',
        select_field: 'Select field',
      },
      {
        name: 'Column 2',
        default_value: 'Default value',
        select_field: 'Select field',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTemplateColumnDto)
  columns: CreateTemplateColumnDto[]
}
