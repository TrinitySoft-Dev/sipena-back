import { PartialType } from '@nestjs/swagger';
import { CreatePasswordHashDto } from './create-password_hash.dto';

export class UpdatePasswordHashDto extends PartialType(CreatePasswordHashDto) {}
