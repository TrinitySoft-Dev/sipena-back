import { Module } from '@nestjs/common'
import { InfoworkersService } from './infoworkers.service'
import { InfoworkersController } from './infoworkers.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Infoworker } from './entities/infoworker.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Infoworker])],
  controllers: [InfoworkersController],
  providers: [InfoworkersService],
  exports: [InfoworkersService],
})
export class InfoworkersModule {}
