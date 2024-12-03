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
  ParseIntPipe,
  Patch,
  DefaultValuePipe,
  ParseBoolPipe,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/worker-user.dto'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger'
import { exampleUserSchema, userSchema } from './schemas/users.schema'
import { LoginUserDto } from './dto/login-user.dto'
import { ClientUserDto } from './dto/client.user.dto'
import { AuthGuard } from '@/common/guards/auth.guard'
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { Response } from 'express'
import { ForgotUserDto } from './dto/forgot.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { RefreshTokenDto } from '@/users/dto/refresh-toke.dto'

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
          new FileTypeValidator({ fileType: 'image/*' }),
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

  @Post('refresh-token')
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.usersService.refreshToken(refreshTokenDto.refreshToken)
  }

  @Post('forgot')
  forgot(@Body() forgotUserDto: ForgotUserDto) {
    return this.usersService.forgotPasssword(forgotUserDto.email)
  }

  @Post('reset')
  reset(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.usersService.resetPassword(resetPasswordDto)
  }

  // @ApiBearerAuth()
  // @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Find users by role',
    description: 'This method returns users by role',
  })
  @Get('role')
  findByRole(
    @Query('role') role: string,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page?: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize?: number,
    @Query('includePagination', new DefaultValuePipe(false), ParseBoolPipe) includePagination?: boolean,
  ) {
    return this.usersService.findByRole({ role, page, pageSize, includePagination })
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/:id')
  findByRoleId(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id)
  }

  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'visa', maxCount: 1 },
        { name: 'passport', maxCount: 1 },
      ],
      {
        limits: { fileSize: 10 * 1024 * 1024 },
      },
    ),
  )
  @Put(':id')
  update(
    @UploadedFiles()
    files: { visa?: Express.Multer.File[]; passport?: Express.Multer.File[] },
    @Param('id')
    id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const visa = files?.visa ? files.visa[0] : null
    const passport = files?.passport ? files.passport[0] : null

    return this.usersService.update({ id, updateUserDto, visa, passport })
  }

  @Patch(':id/avatar')
  updateAvatar(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateAvatar(id, updateUserDto)
  }
}
