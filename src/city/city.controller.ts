import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common'
import { CityService } from './city.service'
import { CreateCityDto } from './dto/create-city.dto'
import { UpdateCityDto } from './dto/update-city.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@/common/guards/auth.guard'

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('City')
@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Post()
  create(@Body() createCityDto: CreateCityDto) {
    return this.cityService.create(createCityDto)
  }

  @Get()
  findAll() {
    return this.cityService.findAll()
  }

  @Get('test')
  test() {
    return 'Hello PRE'
  }
}
