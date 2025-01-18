import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common'
import { EmailService } from './email.service'
import { CreateEmailDto } from './dto/create-email.dto'
import { UpdateEmailDto } from './dto/update-email.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@/common/guards/auth.guard'

@ApiTags('Email')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  send(@Body() createEmailDto: CreateEmailDto) {
    return this.emailService.send(createEmailDto)
  }

  @Get('/debug-sentry')
  getError() {
    throw new Error('My first Sentry error!')
  }
}
