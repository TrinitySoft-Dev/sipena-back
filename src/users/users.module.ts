import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { InfoworkersModule } from '@/infoworkers/infoworkers.module'
import { ImagesModule } from '@/images/images.module'

@Module({
  imports: [TypeOrmModule.forFeature([User]), InfoworkersModule, ImagesModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
