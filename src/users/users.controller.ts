import { Controller, Post, Body, Query, Get, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/worker-user.dto'
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger'
import { exampleUserSchema, userSchema } from './schemas/users.schema'
import { LoginUserDto } from './dto/login-user.dto'
import { ClientUserDto } from './dto/client.user.dto'
import { AuthGuard } from '@/common/guards/auth.guard'

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBody({
    schema: userSchema,
    examples: exampleUserSchema,
  })
  @Post('register')
  create(@Body() createUserDto: CreateUserDto | ClientUserDto) {
    return this.usersService.create(createUserDto)
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
