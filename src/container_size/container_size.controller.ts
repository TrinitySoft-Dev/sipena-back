import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Put,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
  ParseBoolPipe,
  Delete,
} from '@nestjs/common'
import { ContainerSizeService } from './container_size.service'
import { CreateContainerSizeDto } from './dto/create-container_size.dto'
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@/common/guards/auth.guard'

@ApiTags('Container size')
// @ApiBearerAuth()
// @UseGuards(AuthGuard)
@Controller('container-size')
export class ContainerSizeController {
  constructor(private readonly containerSizeService: ContainerSizeService) {}

  @Post('/')
  create(@Body() createContainerSizeDto: CreateContainerSizeDto) {
    return this.containerSizeService.create(createContainerSizeDto)
  }

  @Get('/')
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'includePagination',
    required: false,
    type: Boolean,
  })
  async find(
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page?: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize?: number,
    @Query('includePagination', new DefaultValuePipe(false), ParseBoolPipe) includePagination?: boolean,
  ) {
    return await this.containerSizeService.find({ page, pageSize, includePagination })
  }

  @Get('/:id')
  findById(@Param('id') id: number) {
    return this.containerSizeService.findById(id)
  }

  @Put('/:id')
  update(@Param('id') id: number, @Body() createContainerSizeDto: CreateContainerSizeDto) {
    return this.containerSizeService.update(id, createContainerSizeDto)
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.containerSizeService.delete(id)
  }
}
