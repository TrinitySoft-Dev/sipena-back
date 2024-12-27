import { Module } from '@nestjs/common'
import { EmailService } from './email.service'
import { EmailController } from './email.controller'
import { AdminEmailsModule } from '@/admin_emails/admin_emails.module'

@Module({
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
  imports: [AdminEmailsModule],
})
export class EmailModule {}
