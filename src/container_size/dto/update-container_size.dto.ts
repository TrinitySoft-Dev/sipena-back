import { PartialType } from '@nestjs/swagger';
import { CreateContainerSizeDto } from './create-container_size.dto';

export class UpdateContainerSizeDto extends PartialType(CreateContainerSizeDto) {}
