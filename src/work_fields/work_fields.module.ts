import { Module } from '@nestjs/common'
import { WorkFieldsService } from './work_fields.service'
import { WorkFieldsController } from './work_fields.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { WorkField } from './entities/work_field.entity'
import { AccessJwtService } from '@/common/services/access-jwt.service'

@Module({
  imports: [TypeOrmModule.forFeature([WorkField])],
  controllers: [WorkFieldsController],
  providers: [WorkFieldsService, AccessJwtService],
})
export class WorkFieldsModule {}
