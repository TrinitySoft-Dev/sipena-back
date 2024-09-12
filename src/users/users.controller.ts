import {
  Controller,
  Post,
  Body,
  Query,
  Get,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/worker-user.dto'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger'
import { exampleUserSchema, userSchema } from './schemas/users.schema'
import { LoginUserDto } from './dto/login-user.dto'
import { ClientUserDto } from './dto/client.user.dto'
import { AuthGuard } from '@/common/guards/auth.guard'
import { FilesInterceptor } from '@nestjs/platform-express'

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBody({
    schema: userSchema,
    examples: exampleUserSchema,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  @Post('register')
  create(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 100000 }), new FileTypeValidator({ fileType: 'image/jpeg' })],
      }),
    )
    files: Express.Multer.File[],
    @Body() createUserDto: CreateUserDto | ClientUserDto,
  ) {
    return this.usersService.create(createUserDto, files)
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto)
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('role')
  findByRole(@Query('role') role: string) {
    return this.usersService.findByRole(role)
  }
}
