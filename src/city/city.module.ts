import { Module } from '@nestjs/common'
import { CityService } from './city.service'
import { CityController } from './city.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { City } from './entities/city.entity'
import { AccessJwtService } from '@/common/services/access-jwt.service'

@Module({
  imports: [TypeOrmModule.forFeature([City])],
  controllers: [CityController],
  providers: [CityService, AccessJwtService],
})
export class CityModule {}
