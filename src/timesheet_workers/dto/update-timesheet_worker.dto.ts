import { PartialType } from '@nestjs/swagger';
import { CreateTimesheetWorkerDto } from './create-timesheet_worker.dto';

export class UpdateTimesheetWorkerDto extends PartialType(CreateTimesheetWorkerDto) {}
