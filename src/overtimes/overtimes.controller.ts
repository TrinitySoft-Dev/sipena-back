import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
} from '@nestjs/common'
import { OvertimesService } from './overtimes.service'
import { CreateOvertimeDto } from './dto/create-overtime.dto'
import { UpdateOvertimeDto } from './dto/update-overtime.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Overtimes')
@Controller('overtimes')
export class OvertimesController {
  constructor(private readonly overtimesService: OvertimesService) {}

  @Get('')
  find(
    @Query('page', new ParseIntPipe(), new DefaultValuePipe(0)) page: number,
    @Query('pageSize', new ParseIntPipe(), new DefaultValuePipe(10)) pageSize: number,
  ) {
    return this.overtimesService.selectAll({
      page,
      pageSize,
    })
  }

  @Get('/select')
  select() {
    return this.overtimesService.select()
  }

  findById(@Param('id', new ParseIntPipe()) id: number) {
    return this.overtimesService.findById(id)
  }

  @Post()
  create(@Body() createOvertimeDto: CreateOvertimeDto) {
    return this.overtimesService.create(createOvertimeDto)
  }

  @Put(':id')
  update(@Param('id', new ParseIntPipe()) id: number, @Body() updateOvertimeDto: UpdateOvertimeDto) {
    return this.overtimesService.update(id, updateOvertimeDto)
  }
}
