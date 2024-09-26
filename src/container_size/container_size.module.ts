import { Module } from '@nestjs/common'
import { ContainerSizeService } from './container_size.service'
import { ContainerSizeController } from './container_size.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ContainerSize } from './entities/container_size.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ContainerSize])],
  controllers: [ContainerSizeController],
  providers: [ContainerSizeService],
})
export class ContainerSizeModule {}
