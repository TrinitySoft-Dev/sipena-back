import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { TemplateColumnsService } from './template_columns.service'
import { CreateTemplateColumnDto } from './dto/create-template_column.dto'
import { UpdateTemplateColumnDto } from './dto/update-template_column.dto'

@Controller('template-columns')
export class TemplateColumnsController {
  constructor(private readonly templateColumnsService: TemplateColumnsService) {}

  @Post()
  create(@Body() createTemplateColumnDto: CreateTemplateColumnDto) {
    return this.templateColumnsService.create(createTemplateColumnDto)
  }

  // @Get()
  // findAll() {
  //   return this.templateColumnsService.findAll()
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.templateColumnsService.findByTemplateId(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTemplateColumnDto: UpdateTemplateColumnDto) {
    return this.templateColumnsService.update(+id, updateTemplateColumnDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.templateColumnsService.remove(+id)
  }
}
