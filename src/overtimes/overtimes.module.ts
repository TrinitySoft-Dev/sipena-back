import { Module } from '@nestjs/common'
import { OvertimesService } from './overtimes.service'
import { OvertimesController } from './overtimes.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Overtime } from './entities/overtime.entity'
import { AccessJwtService } from '@/common/services/access-jwt.service'

@Module({
  imports: [TypeOrmModule.forFeature([Overtime])],
  controllers: [OvertimesController],
  providers: [OvertimesService, AccessJwtService],
  exports: [OvertimesService],
})
export class OvertimesModule {}
