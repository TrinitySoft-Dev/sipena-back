import { Valuecell } from '@/common/validators/Valuecell'
import { ApiProperty } from '@nestjs/swagger'
import { IsString, Validate } from 'class-validator'

export class CreateTemplateColumnDto {
  @ApiProperty({
    type: 'string',
    description: 'The name of the template_column',
  })
  @IsString()
  name: string

  @ApiProperty({
    type: 'string',
    description: 'Customer name: @path:customer_name',
  })
  @Validate(Valuecell, { message: 'Invalid path' })
  value_cell: string
}
