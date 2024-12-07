import { PartialType } from '@nestjs/swagger';
import { CreateWorkFieldDto } from './create-work_field.dto';

export class UpdateWorkFieldDto extends PartialType(CreateWorkFieldDto) {}
