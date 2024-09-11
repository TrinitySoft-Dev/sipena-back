import { PartialType } from '@nestjs/swagger';
import { CreateInfoworkerDto } from './create-infoworker.dto';

export class UpdateInfoworkerDto extends PartialType(CreateInfoworkerDto) {}
