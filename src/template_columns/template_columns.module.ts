import { Module } from '@nestjs/common'
import { TemplateColumnsService } from './template_columns.service'
import { TemplateColumnsController } from './template_columns.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TemplateColumn } from './entities/template_column.entity'

@Module({
  imports: [TypeOrmModule.forFeature([TemplateColumn])],
  controllers: [TemplateColumnsController],
  providers: [TemplateColumnsService],
})
export class TemplateColumnsModule {}
