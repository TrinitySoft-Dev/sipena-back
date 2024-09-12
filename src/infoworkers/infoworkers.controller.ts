import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common'
import { InfoworkersService } from './infoworkers.service'
import { CreateInfoworkerDto } from './dto/create-infoworker.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@/common/guards/auth.guard'

@ApiTags('Infoworkers')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('infoworkers')
export class InfoworkersController {
  constructor(private readonly infoworkersService: InfoworkersService) {}

  @Post()
  create(@Body() createInfoworkerDto: CreateInfoworkerDto) {
    return this.infoworkersService.create(createInfoworkerDto)
  }
}
