import { Controller, Post, Body, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common'
import { ImagesService } from './images.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@/common/guards/auth.guard'

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file: Express.Multer.File) {
    return this.imagesService.upload(file)
  }
}
