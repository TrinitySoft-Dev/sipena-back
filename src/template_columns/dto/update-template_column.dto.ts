import { PartialType } from '@nestjs/swagger'
import { CreateTemplateColumnDto } from './create-template_column.dto'
import { IsNumber, IsUUID } from 'class-validator'

export class UpdateTemplateColumnDto extends PartialType(CreateTemplateColumnDto) {
  @IsUUID()
  id: number
}
