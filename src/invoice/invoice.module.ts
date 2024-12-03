import { Module } from '@nestjs/common'
import { InvoiceService } from './invoice.service'
import { InvoiceController } from './invoice.controller'
import { TimesheetModule } from '@/timesheet/timesheet.module'
import { TemplateModule } from '@/template/template.module'

@Module({
  imports: [TimesheetModule, TemplateModule],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
