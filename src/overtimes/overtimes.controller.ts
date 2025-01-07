import { Controller, Get, Post, Body, Patch, Param, Delete, Put, ParseIntPipe } from '@nestjs/common'
import { OvertimesService } from './overtimes.service'
import { CreateOvertimeDto } from './dto/create-overtime.dto'
import { UpdateOvertimeDto } from './dto/update-overtime.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Overtimes')
@Controller('overtimes')
export class OvertimesController {
  constructor(private readonly overtimesService: OvertimesService) {}

  @Post()
  create(@Body() createOvertimeDto: CreateOvertimeDto) {
    return this.overtimesService.create(createOvertimeDto)
  }

  @Put(':id')
  update(@Param('id', new ParseIntPipe()) id: number, @Body() updateOvertimeDto: UpdateOvertimeDto) {
    return this.overtimesService.update(id, updateOvertimeDto)
  }
}
