import { PartialType } from '@nestjs/swagger';
import { CreateTemplateColumnDto } from './create-template_column.dto';

export class UpdateTemplateColumnDto extends PartialType(CreateTemplateColumnDto) {}
