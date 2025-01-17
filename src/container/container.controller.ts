import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common'
import { ContainerService } from './container.service'
import { CreateContainerDto } from './dto/create-container.dto'
import { UpdateContainerDto } from './dto/update-container.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@/common/guards/auth.guard'

@ApiTags('Container')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('container')
export class ContainerController {
  constructor(private readonly containerService: ContainerService) {}

  @Post()
  create(@Body() createContainerDto: CreateContainerDto) {
    return this.containerService.create(createContainerDto)
  }

  @Get('/validate-container-number')
  validateContainerNumber(@Query('containerNumber') containerNumber: string) {
    return this.containerService.validateContainerNumber(containerNumber)
  }
}
