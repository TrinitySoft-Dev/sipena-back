import { PartialType } from '@nestjs/swagger';
import { CreateConditionGroupDto } from './create-condition_group.dto';

export class UpdateConditionGroupDto extends PartialType(CreateConditionGroupDto) {}
