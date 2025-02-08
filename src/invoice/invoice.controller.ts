import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards } from '@nestjs/common'
import { InvoiceService } from './invoice.service'
import { CreateInvoiceDto } from './dto/create-invoice.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@/common/guards/auth.guard'

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('Invoice')
@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  async create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoiceService.create(createInvoiceDto)
  }

  @Post('pdf')
  async generatePDF(@Body() createInvoiceDTO: CreateInvoiceDto): Promise<string> {
    return this.invoiceService.generatePDF(createInvoiceDTO)
  }
}
