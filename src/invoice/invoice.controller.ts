import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common'
import { InvoiceService } from './invoice.service'
import { CreateInvoiceDto } from './dto/create-invoice.dto'
import { ApiTags } from '@nestjs/swagger'
import { Response } from 'express'

@ApiTags('Invoice')
@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  async create(@Body() createInvoiceDto: CreateInvoiceDto, @Res() res: Response) {
    const stream = await this.invoiceService.create(createInvoiceDto)

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${createInvoiceDto.invoice_number}.xlsx"`)

    stream.pipe(res)
  }
}
