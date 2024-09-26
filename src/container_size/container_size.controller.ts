import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common'
import { ContainerSizeService } from './container_size.service'
import { CreateContainerSizeDto } from './dto/create-container_size.dto'
import { ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@/common/guards/auth.guard'

@ApiTags('ContainerSize')
@UseGuards(AuthGuard)
@Controller('container-size')
export class ContainerSizeController {
  constructor(private readonly containerSizeService: ContainerSizeService) {}

  @Post()
  create(@Body() createContainerSizeDto: CreateContainerSizeDto) {
    return this.containerSizeService.create(createContainerSizeDto)
  }

  @Get()
  find() {
    return this.containerSizeService.find()
  }
}
