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
  Delete,
  Req,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/worker-user.dto'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger'
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

  @ApiOperation({
    summary: 'Find users by role, name, and email',
    description: 'This method returns users by role, name, and email',
  })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'email', required: false })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('role')
  findByRole(
    @Req() req: any,
    @Query('role') role: string,
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page?: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize?: number,
    @Query('includePagination', new DefaultValuePipe(false), ParseBoolPipe) includePagination?: boolean,
  ) {
    return this.usersService.findByRole({
      role,
      name,
      email,
      page,
      pageSize,
      includePagination,
      currentUser: req.payload,
    })
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

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id/avatar')
  updateAvatar(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateAvatar(id, updateUserDto)
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id/update-password')
  @ApiParam({ name: 'id', required: true, type: Number, description: 'User ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        oldPassword: { type: 'string', description: 'The current password of the user' },
        newPassword: { type: 'string', description: 'The new password to set' },
      },
      required: ['oldPassword', 'newPassword'],
    },
  })
  updatePassword(@Param('id') id: number, @Body() updatePasswordDto: { oldPassword: string; newPassword: string }) {
    const { oldPassword, newPassword } = updatePasswordDto
    return this.usersService.updatePassword(id, oldPassword, newPassword)
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id/status')
  updateStatus(@Param('id') id: number, @Body() updateUserDto: any) {
    return this.usersService.updateStatus(id, updateUserDto.status)
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.usersService.delete(id)
  }
}
