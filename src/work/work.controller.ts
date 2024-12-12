import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Param,
  Put,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
  ParseBoolPipe,
} from '@nestjs/common'
import { WorkService } from './work.service'
import { CreateWorkDto } from './dto/create-work.dto'
import { ApiQuery, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@/common/guards/auth.guard'
import { UpdateWorkDto } from './dto/update-work.dto'

@ApiTags('Work')
// @UseGuards(AuthGuard)
@Controller('work')
export class WorkController {
  constructor(private readonly workService: WorkService) {}

  @Post()
  create(@Body() createWorkDto: CreateWorkDto) {
    return this.workService.create(createWorkDto)
  }

  @Get()
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
  find(
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page?: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize?: number,
    @Query('includePagination', new DefaultValuePipe(false), ParseBoolPipe) includePagination?: boolean,
  ) {
    return this.workService.find({ page, pageSize, includePagination })
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.workService.findById(id)
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateWorkDto: UpdateWorkDto) {
    return this.workService.update(id, updateWorkDto)
  }
}
