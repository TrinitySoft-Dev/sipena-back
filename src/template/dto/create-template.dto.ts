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
        value_cell: 'Customer name: @path:customer_name \n Customer address: @path:customer_address',
      },
      {
        name: 'Column 2',
        value_cell: 'Customer name: @path:customer_name',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTemplateColumnDto)
  columns: CreateTemplateColumnDto[]

  @ApiProperty({
    type: 'string',
    description: 'The type of the template',
    example: 'CUSTOMER',
  })
  @IsString()
  type: string
}
