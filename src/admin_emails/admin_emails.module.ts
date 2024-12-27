import { Module } from '@nestjs/common'
import { AdminEmailsService } from './admin_emails.service'
import { AdminEmailsController } from './admin_emails.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AdminEmail } from './entities/admin_email.entity'

@Module({
  imports: [TypeOrmModule.forFeature([AdminEmail])],
  controllers: [AdminEmailsController],
  providers: [AdminEmailsService],
  exports: [AdminEmailsService],
})
export class AdminEmailsModule {}
