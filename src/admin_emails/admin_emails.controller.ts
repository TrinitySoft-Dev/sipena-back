import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { AdminEmailsService } from './admin_emails.service'
import { CreateAdminEmailDto } from './dto/create-admin_email.dto'
import { UpdateAdminEmailDto } from './dto/update-admin_email.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Admin email')
@Controller('admin-emails')
export class AdminEmailsController {
  constructor(private readonly adminEmailsService: AdminEmailsService) {}

  @Post()
  create(@Body() createAdminEmailDto: CreateAdminEmailDto) {
    return this.adminEmailsService.create(createAdminEmailDto)
  }
}
