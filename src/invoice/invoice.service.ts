import { Injectable } from '@nestjs/common'
import { CreateInvoiceDto } from './dto/create-invoice.dto'
import { UpdateInvoiceDto } from './dto/update-invoice.dto'

@Injectable()
export class InvoiceService {
  create(createInvoiceDto: CreateInvoiceDto) {
    return 'This action adds a new invoice'
  }
}
