import { Module } from '@nestjs/common'
import { InfoworkersService } from './infoworkers.service'
import { InfoworkersController } from './infoworkers.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Infoworker } from './entities/infoworker.entity'
import { AccessJwtService } from '@/common/services/access-jwt.service'

@Module({
  imports: [TypeOrmModule.forFeature([Infoworker])],
  controllers: [InfoworkersController],
  providers: [InfoworkersService, AccessJwtService],
  exports: [InfoworkersService],
})
export class InfoworkersModule {}
