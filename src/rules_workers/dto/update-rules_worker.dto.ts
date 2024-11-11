import { PartialType } from '@nestjs/swagger';
import { CreateRulesWorkerDto } from './create-rules_worker.dto';

export class UpdateRulesWorkerDto extends PartialType(CreateRulesWorkerDto) {}
