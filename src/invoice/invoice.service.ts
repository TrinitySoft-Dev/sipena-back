import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateInvoiceDto } from './dto/create-invoice.dto'
import { TimesheetService } from '@/timesheet/timesheet.service'
import { TemplateService } from '@/template/template.service'
import * as excel4node from 'excel4node'
import { Readable } from 'stream'
import { ImagesService } from '@/images/images.service'
import { TimesheetStatusEnum } from '@/timesheet/entities/timesheet.entity'
import { DateTime } from 'luxon'

@Injectable()
export class InvoiceService {
  constructor(
    private readonly timesheetService: TimesheetService,
    private readonly templateService: TemplateService,
    private readonly imageService: ImagesService,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto) {
    const { reference_week, customer, invoice_number } = createInvoiceDto
    let timesheets = await this.timesheetService.findTimesheetsByWeek(reference_week, customer, createInvoiceDto.type)
    const template = await this.templateService.findOne(createInvoiceDto.template)
    const columns = await this.resolverColumns(template, timesheets, createInvoiceDto)

    const headers = Object.keys(columns)
    const wb = new excel4node.Workbook()
    const ws = wb.addWorksheet(`Invoice - ${invoice_number}`)

    const cellStyle = wb.createStyle({
      alignment: {
        horizontal: 'left',
        wrapText: true,
      },
    })

    headers.forEach((header, colIndex) => {
      const rows = columns[header].rows
      const maxWidth = Math.max(header?.length, ...rows.map(row => row?.length || 10))
      ws.column(colIndex + 1).setWidth(maxWidth)

      ws.cell(1, colIndex + 1).string(header)

      rows.forEach((row, rowIndex) => {
        const type = typeof row === 'undefined' ? 'string' : typeof row

        const cellValue =
          typeof row === 'string'
            ? row
                .replace(/\\n/g, '\n')
                .split('\n')
                .map(line => line.trim())
                .join('\n')
            : row

        ws.cell(rowIndex + 2, colIndex + 1)
          [type](cellValue)
          .style(cellStyle)
      })
    })

    const buffer = await wb.writeToBuffer()
    const downloadURL = await this.imageService.uploadOtherFiles(
      buffer,
      'invoices',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )

    return downloadURL
  }

  async generatePDF(createInvoiceDto: CreateInvoiceDto) {
    const { reference_week, template, customer } = createInvoiceDto
    const resultTemplate = this.templateService.findOne(template)

    if (!resultTemplate) throw new NotFoundException('Template not found')
    const timesheets = await this.timesheetService.findTimesheetsByWeek(
      reference_week,
      createInvoiceDto.customer,
      createInvoiceDto.type,
    )

    // const columns = await this.resolverColumns(resultTemplate, timesheets)
  }

  private async resolverColumns(template, timesheets, body: CreateInvoiceDto) {
    const columns = {}

    template.columns.forEach(column => {
      const valueCell = column.value_cell
      if (!columns[column.name]) {
        columns[column.name] = {
          rows: [],
        }
      }
      timesheets.forEach(timesheet => {
        const valueReplacecell = valueCell?.replace(/@path:([\w.]+)/g, (match, p1) => {
          if (p1 === 'invoice_number') return body.invoice_number
          if (p1 === 'reference_week') return body.reference_week
          if (p1 === 'invoice_date') return DateTime.fromISO(body.invoice_date.toString()).toFormat('dd/MM/yyyy')
          if (p1 === 'due_date') return DateTime.fromISO(body.due_date.toISOString()).toFormat('dd/MM/yyyy')
          if (!p1.includes('_')) p1 = `timesheet_${p1}`
          return timesheet[p1]
        })

        if (!columns[column.name].rows.length) columns[column.name].rows.push(valueReplacecell)
        else {
          columns[column.name].rows = [...columns[column.name].rows, valueReplacecell]
        }

        this.timesheetService.closeTimesheet(timesheet.id)
      })
    })

    return columns
  }
}
