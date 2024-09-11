import { Controller, Get, Post, Body } from '@nestjs/common'
import { InfoworkersService } from './infoworkers.service'
import { CreateInfoworkerDto } from './dto/create-infoworker.dto'

@Controller('infoworkers')
export class InfoworkersController {
  constructor(private readonly infoworkersService: InfoworkersService) {}

  @Post()
  create(@Body() createInfoworkerDto: CreateInfoworkerDto) {
    return this.infoworkersService.create(createInfoworkerDto)
  }
}
