import { PartialType } from '@nestjs/swagger';
import { CreateRulesConditionDto } from './create-rules-condition.dto';

export class UpdateRulesConditionDto extends PartialType(CreateRulesConditionDto) {}
