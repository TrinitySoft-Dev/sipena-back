import { PartialType } from '@nestjs/swagger';
import { CreateExtraRulesWorkerDto } from './create-extra_rules_worker.dto';

export class UpdateExtraRulesWorkerDto extends PartialType(CreateExtraRulesWorkerDto) {}
