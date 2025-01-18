import { Controller, Post, Body, Delete, UseGuards } from '@nestjs/common'
import { PasswordHashService } from './password_hash.service'
import { CreatePasswordHashDto } from './dto/create-password_hash.dto'
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@/common/guards/auth.guard'

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('Password Hash')
@Controller('password-hash')
export class PasswordHashController {
  constructor(private readonly passwordHashService: PasswordHashService) {}

  @ApiExcludeEndpoint()
  @Post()
  create(@Body() createPasswordHashDto: CreatePasswordHashDto) {
    return this.passwordHashService.create(createPasswordHashDto)
  }
}
