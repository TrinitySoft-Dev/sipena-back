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
  Put,
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

  @Get('select')
  findSelect() {
    return this.templateService.findSelect()
  }

  @Get('fields')
  fields() {
    return this.templateService.fields()
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.templateService.findOne(id)
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTemplateDto: UpdateTemplateDto) {
    return this.templateService.update(id, updateTemplateDto)
  }
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.templateService.delete(id)
  }
}
