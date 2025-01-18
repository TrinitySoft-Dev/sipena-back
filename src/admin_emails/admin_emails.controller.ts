import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common'
import { AdminEmailsService } from './admin_emails.service'
import { CreateAdminEmailDto } from './dto/create-admin_email.dto'
import { UpdateAdminEmailDto } from './dto/update-admin_email.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@/common/guards/auth.guard'

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('Admin email')
@Controller('admin-emails')
export class AdminEmailsController {
  constructor(private readonly adminEmailsService: AdminEmailsService) {}

  @Post()
  create(@Body() createAdminEmailDto: CreateAdminEmailDto) {
    return this.adminEmailsService.create(createAdminEmailDto)
  }
}
