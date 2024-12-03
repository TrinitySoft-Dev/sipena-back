import { Injectable } from '@nestjs/common'
import { CreateInvoiceDto } from './dto/create-invoice.dto'
import { TimesheetService } from '@/timesheet/timesheet.service'
import { TemplateService } from '@/template/template.service'
import * as excel4node from 'excel4node'
import { Readable, Writable } from 'stream'

@Injectable()
export class InvoiceService {
  constructor(
    private readonly timesheetService: TimesheetService,
    private readonly templateService: TemplateService,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Readable> {
    const { reference_week, customer, invoice_number } = createInvoiceDto
    const timesheets = await this.timesheetService.findTimesheetsByWeek(reference_week, customer)

    const template = await this.templateService.findOne(createInvoiceDto.template)
    const columns = await this.resolverColumns(template, timesheets)

    const headers = Object.keys(columns)
    const wb = new excel4node.Workbook()
    const ws = wb.addWorksheet(`Invoice - ${invoice_number}`)

    headers.forEach((header, colIndex) => {
      const rows = columns[header].rows
      const maxWidth = Math.max(header.length, ...rows.map(row => row.length)) + 5
      ws.column(colIndex + 1).setWidth(maxWidth)

      ws.cell(1, colIndex + 1).string(header)

      rows.forEach((row, rowIndex) => {
        ws.cell(rowIndex + 2, colIndex + 1).string(row)
      })
    })

    const buffer = await wb.writeToBuffer()
    const stream = new Readable()
    stream.push(buffer)
    stream.push(null)

    return stream
  }

  private async resolverColumns(template, timesheets) {
    const columns = {}

    template.columns.forEach(column => {
      const select_field = column.select_field.replaceAll('.', '_')
      if (!columns[column.name]) {
        columns[column.name] = {
          rows: [],
        }
      }

      timesheets.forEach(timesheet => {
        if (!columns[column.name].rows.length) columns[column.name].rows.push(timesheet[select_field])
        else {
          columns[column.name].rows = [...columns[column.name].rows, timesheet[select_field]]
        }

        this.timesheetService.update(timesheet.id, { status: 'CLOSED' })
      })
    })

    return columns
  }
}
