import { Controller, Post, Body } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { ApiBody, ApiTags } from '@nestjs/swagger'
import { exampleUserSchema, userSchema } from './schemas/users.schema'
import { LoginUserDto } from './dto/login-user.dto'

@ApiTags('Auth')
@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBody({
    schema: userSchema,
    examples: exampleUserSchema,
  })
  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto)
  }
}
