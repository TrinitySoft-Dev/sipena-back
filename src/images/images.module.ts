import { Module } from '@nestjs/common'
import { ImagesService } from './images.service'
import { ImagesController } from './images.controller'
import { AccessJwtService } from '@/common/services/access-jwt.service'

@Module({
  controllers: [ImagesController],
  providers: [ImagesService, AccessJwtService],
  exports: [ImagesService],
})
export class ImagesModule {}
