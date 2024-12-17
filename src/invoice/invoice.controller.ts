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
  async create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoiceService.create(createInvoiceDto)
  }
}
