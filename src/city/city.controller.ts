import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { CityService } from './city.service'
import { CreateCityDto } from './dto/create-city.dto'
import { UpdateCityDto } from './dto/update-city.dto'
import { ApiTags } from '@nestjs/swagger'

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
