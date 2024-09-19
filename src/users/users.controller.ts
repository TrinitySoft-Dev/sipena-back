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
  Param,
  Put,
  Res,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/worker-user.dto'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger'
import { exampleUserSchema, userSchema } from './schemas/users.schema'
import { LoginUserDto } from './dto/login-user.dto'
import { ClientUserDto } from './dto/client.user.dto'
import { AuthGuard } from '@/common/guards/auth.guard'
import { FilesInterceptor } from '@nestjs/platform-express'
import { Response } from 'express'

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBody({
    schema: userSchema,
    examples: exampleUserSchema,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('files', 2, {
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  )
  @Post('register')
  create(
    @UploadedFiles(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    files: Express.Multer.File[],
    @Body() createUserDto: CreateUserDto | ClientUserDto,
  ) {
    return this.usersService.create(createUserDto, files)
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto, @Res({ passthrough: true }) res: Response) {
    return this.usersService.login(loginUserDto, res)
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('role')
  findByRole(@Query('role') role: string) {
    return this.usersService.findByRole(role)
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put(':id')
  update(@Param('id') id: number, @Body() updateUserDto: CreateUserDto | ClientUserDto) {
    return this.usersService.update(id, updateUserDto)
  }
}
