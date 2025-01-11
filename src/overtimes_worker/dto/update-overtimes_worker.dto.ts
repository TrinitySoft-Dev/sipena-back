import { PartialType } from '@nestjs/swagger';
import { CreateOvertimesWorkerDto } from './create-overtimes_worker.dto';

export class UpdateOvertimesWorkerDto extends PartialType(CreateOvertimesWorkerDto) {}
