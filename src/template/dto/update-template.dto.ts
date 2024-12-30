import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { CreateTemplateDto } from './create-template.dto'
import { UpdateTemplateColumnDto } from '@/template_columns/dto/update-template_column.dto'
import { IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class UpdateTemplateDto extends PartialType(OmitType(CreateTemplateDto, ['columns'])) {
  @ApiProperty({
    type: [UpdateTemplateColumnDto],
    description: 'The columns of the template',
    example: [
      {
        id: 1,
        name: 'Column 1',
        value_cell: 'Customer name: @path:customer_name \n Customer address: @path:customer_address',
      },
      {
        id: 2,
        name: 'Column 2',
        value_cell: 'Customer name: @path:customer_name',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateTemplateColumnDto)
  columns: UpdateTemplateColumnDto[]
}
