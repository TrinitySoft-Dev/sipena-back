import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common'
import { EmailService } from './email.service'
import { CreateEmailDto } from './dto/create-email.dto'
import { UpdateEmailDto } from './dto/update-email.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@/common/guards/auth.guard'

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('Email')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  send(@Body() createEmailDto: CreateEmailDto) {
    return this.emailService.send(createEmailDto)
  }
}
