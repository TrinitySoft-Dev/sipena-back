import { Module } from '@nestjs/common'
import { EmailService } from './email.service'
import { EmailController } from './email.controller'
import { AdminEmailsModule } from '@/admin_emails/admin_emails.module'
import { AccessJwtService } from '@/common/services/access-jwt.service'

@Module({
  controllers: [EmailController],
  providers: [EmailService, AccessJwtService],
  exports: [EmailService],
  imports: [AdminEmailsModule],
})
export class EmailModule {}
