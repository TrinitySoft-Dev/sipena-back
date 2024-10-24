import { PartialType } from '@nestjs/swagger';
import { CreateExtraRuleDto } from './create-extra_rule.dto';

export class UpdateExtraRuleDto extends PartialType(CreateExtraRuleDto) {}
