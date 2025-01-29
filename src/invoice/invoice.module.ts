import { Module } from '@nestjs/common'
import { InvoiceService } from './invoice.service'
import { InvoiceController } from './invoice.controller'
import { TimesheetModule } from '@/timesheet/timesheet.module'
import { TemplateModule } from '@/template/template.module'
import { ImagesModule } from '@/images/images.module'
import { AccessJwtService } from '@/common/services/access-jwt.service'
import { UsersModule } from '@/users/users.module'

@Module({
  imports: [TimesheetModule, TemplateModule, ImagesModule, UsersModule],
  controllers: [InvoiceController],
  providers: [InvoiceService, AccessJwtService],
})
export class InvoiceModule {}
