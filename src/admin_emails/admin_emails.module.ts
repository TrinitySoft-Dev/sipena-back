import { Module } from '@nestjs/common'
import { AdminEmailsService } from './admin_emails.service'
import { AdminEmailsController } from './admin_emails.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AdminEmail } from './entities/admin_email.entity'
import { AccessJwtService } from '@/common/services/access-jwt.service'

@Module({
  imports: [TypeOrmModule.forFeature([AdminEmail])],
  controllers: [AdminEmailsController],
  providers: [AdminEmailsService, AccessJwtService],
  exports: [AdminEmailsService],
})
export class AdminEmailsModule {}
