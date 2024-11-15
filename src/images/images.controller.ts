import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, UploadedFiles } from '@nestjs/common'
import { ImagesService } from './images.service'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@/common/guards/auth.guard'

@ApiTags('Images')
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

  @ApiConsumes('multipart/form-data')
  @Post('upload-multiple')
  @UseInterceptors(FilesInterceptor('files'))
  multiUpload(@UploadedFiles() files: Express.Multer.File[]) {
    return this.imagesService.uploadMultiple(files)
  }
}
