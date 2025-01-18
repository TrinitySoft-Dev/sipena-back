import { Module } from '@nestjs/common'
import { TemplateService } from './template.service'
import { TemplateController } from './template.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Template } from './entities/template.entity'
import { AccessJwtService } from '@/common/services/access-jwt.service'

@Module({
  imports: [TypeOrmModule.forFeature([Template])],
  controllers: [TemplateController],
  providers: [TemplateService, AccessJwtService],
  exports: [TemplateService],
})
export class TemplateModule {}
