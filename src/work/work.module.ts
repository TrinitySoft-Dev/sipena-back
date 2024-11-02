import { Module } from '@nestjs/common'
import { WorkService } from './work.service'
import { WorkController } from './work.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Work } from './entities/work.entity'
import { AccessJwtService } from '@/common/services/access-jwt.service'

@Module({
  imports: [TypeOrmModule.forFeature([Work])],
  controllers: [WorkController],
  providers: [WorkService, AccessJwtService],
  exports: [WorkService],
})
export class WorkModule {}
