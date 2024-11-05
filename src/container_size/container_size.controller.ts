import { Controller, Post, Body, UseGuards, Get, Param, Put } from '@nestjs/common'
import { ContainerSizeService } from './container_size.service'
import { CreateContainerSizeDto } from './dto/create-container_size.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@/common/guards/auth.guard'

@ApiTags('Container size')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('container-size')
export class ContainerSizeController {
  constructor(private readonly containerSizeService: ContainerSizeService) {}

  @Post('/')
  create(@Body() createContainerSizeDto: CreateContainerSizeDto) {
    return this.containerSizeService.create(createContainerSizeDto)
  }

  @Get('/')
  find() {
    return this.containerSizeService.find()
  }

  @Get('/:id')
  findById(@Param('id') id: number) {
    return this.containerSizeService.findById(id)
  }

  @Put('/:id')
  update(@Param('id') id: number, @Body() createContainerSizeDto: CreateContainerSizeDto) {
    return this.containerSizeService.update(id, createContainerSizeDto)
  }
}
