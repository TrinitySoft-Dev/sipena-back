import { Controller, Post, Body, Delete, UseGuards } from '@nestjs/common'
import { PasswordHashService } from './password_hash.service'
import { CreatePasswordHashDto } from './dto/create-password_hash.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Password Hash')
@Controller('password-hash')
export class PasswordHashController {
  constructor(private readonly passwordHashService: PasswordHashService) {}

  @Post()
  create(@Body() createPasswordHashDto: CreatePasswordHashDto) {
    return this.passwordHashService.create(createPasswordHashDto)
  }
}
