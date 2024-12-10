import { PartialType } from '@nestjs/swagger';
import { CreateGroupPermissionDto } from './create-group_permission.dto';

export class UpdateGroupPermissionDto extends PartialType(CreateGroupPermissionDto) {}
