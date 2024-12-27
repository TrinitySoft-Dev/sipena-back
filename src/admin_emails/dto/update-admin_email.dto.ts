import { PartialType } from '@nestjs/swagger';
import { CreateAdminEmailDto } from './create-admin_email.dto';

export class UpdateAdminEmailDto extends PartialType(CreateAdminEmailDto) {}
