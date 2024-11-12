import { PartialType } from '@nestjs/swagger';
import { CreatePermissionGroupDto } from './create-permission_group.dto';

export class UpdatePermissionGroupDto extends PartialType(CreatePermissionGroupDto) {}
