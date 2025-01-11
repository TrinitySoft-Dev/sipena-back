import { PartialType } from '@nestjs/swagger';
import { CreateNormalScheduleDto } from './create-normal_schedule.dto';

export class UpdateNormalScheduleDto extends PartialType(CreateNormalScheduleDto) {}
