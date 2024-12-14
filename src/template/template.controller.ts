import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
} from '@nestjs/common'
import { TemplateService } from './template.service'
import { CreateTemplateDto } from './dto/create-template.dto'
import { UpdateTemplateDto } from './dto/update-template.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Template')
@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post()
  create(@Body() createTemplateDto: CreateTemplateDto) {
    return this.templateService.create(createTemplateDto)
  }

  @Post('default')
  createDefaultTemplate() {
    return this.templateService.createDefaultTemplate()
  }

  @Get('/')
  find(
    @Query('page', new ParseIntPipe(), new DefaultValuePipe(0)) page: number,
    @Query('pageSize', new ParseIntPipe(), new DefaultValuePipe(10)) pageSize: number,
  ) {
    return this.templateService.find(page, pageSize)
  }

  @Get('fields')
  fields() {
    return this.templateService.fields()
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.templateService.findOne(id)
  }
}
