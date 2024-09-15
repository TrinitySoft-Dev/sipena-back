import { Module } from '@nestjs/common'
import { ContainerService } from './container.service'
import { ContainerController } from './container.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Container } from './entities/container.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Container])],
  controllers: [ContainerController],
  providers: [ContainerService],
  exports: [ContainerService],
})
export class ContainerModule {}
