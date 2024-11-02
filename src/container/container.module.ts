import { Module } from '@nestjs/common'
import { ContainerService } from './container.service'
import { ContainerController } from './container.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Container } from './entities/container.entity'
import { AccessJwtService } from '@/common/services/access-jwt.service'

@Module({
  imports: [TypeOrmModule.forFeature([Container])],
  controllers: [ContainerController],
  providers: [ContainerService, AccessJwtService],
  exports: [ContainerService],
})
export class ContainerModule {}
