import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateInvoiceDto } from './dto/create-invoice.dto'
import { TimesheetService } from '@/timesheet/timesheet.service'
import { TemplateService } from '@/template/template.service'
import * as excel4node from 'excel4node'
import { ImagesService } from '@/images/images.service'
import { DateTime } from 'luxon'
import * as path from 'node:path'
import PdfPrinter from 'pdfmake'
import { UsersService } from '@/users/users.service'

function mp(fontPath) {
  return path.join(process.cwd(), 'public', 'fonts', fontPath)
}
@Injectable()
export class InvoiceService {
  constructor(
    private readonly timesheetService: TimesheetService,
    private readonly templateService: TemplateService,
    private readonly imageService: ImagesService,
    private readonly userService: UsersService,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto) {
    const { reference_week, customer } = createInvoiceDto

    let timesheets: any = await this.timesheetService.findTimesheetsByWeek(
      reference_week,
      customer,
      createInvoiceDto.type,
    )

    const ids = timesheets.raw.map(timesheet => timesheet.timesheet_id)

    const newTimesheets = timesheets?.raw.map((timesheet: any) => {
      const countWorkers = timesheets.entities.find(entity => entity.id === timesheet.timesheet_id)
      return {
        ...timesheet,
        number_of_workers: countWorkers?.number_of_workers || 0,
      }
    })

    const template = await this.templateService.findOne(createInvoiceDto.template)
    const columns = await this.resolverColumns(template, newTimesheets, createInvoiceDto)

    const headers = Object.keys(columns)

    const csvRows: string[][] = []

    csvRows.push(headers)

    const numRows = Math.max(...headers.map(header => columns[header].rows.length))

    for (let i = 0; i < numRows; i++) {
      const rowData = headers.map(header => {
        let cell = columns[header].rows[i]

        if (typeof cell === 'string') {
          cell = cell
            .replace(/\\n/g, '\n')
            .split('\n')
            .map(line => line.trim())
            .join('\n')
        }
        if (cell === undefined || cell === null) cell = ''

        let cellStr = String(cell)
        if (cellStr.includes('"')) {
          cellStr = cellStr.replace(/"/g, '""')
        }

        if (cellStr.includes(',') || cellStr.includes('\n') || cellStr.includes('"')) {
          cellStr = `"${cellStr}"`
        }
        return cellStr
      })
      csvRows.push(rowData)
    }

    const csvContent = csvRows.map(row => row.join(',')).join('\n')
    const buffer = Buffer.from(csvContent, 'utf-8')

    const downloadURL = await this.imageService.uploadOtherFiles(buffer, 'invoices', 'text/csv')
    this.timesheetService.closeTimesheet(ids)

    return downloadURL
  }

  async generatePDF(createInvoiceDto: CreateInvoiceDto) {
    const { reference_week, template, type } = createInvoiceDto
    const resultTemplate = await this.templateService.findOne(template)

    const dataUser = await this.userService.findOne({
      where: { id: createInvoiceDto.customer },
      relations: [type === 'WORKER' ? 'infoworker' : ''],
    })

    if (!resultTemplate) throw new NotFoundException('Template not found')
    const timesheets: any = await this.timesheetService.findTimesheetsByWeek(
      reference_week,
      createInvoiceDto.customer,
      createInvoiceDto.type,
    )

    const newTimesheets = timesheets?.raw.map((timesheet: any) => {
      const countWorkers = timesheets.entities.find(entity => entity.id === timesheet.timesheet_id)
      return {
        ...timesheet,
        number_of_workers: countWorkers?.number_of_workers || 0,
      }
    })

    const total = newTimesheets.reduce((acc, timesheet) => {
      if (type === 'WORKER') {
        return acc + timesheet.timesheet_workers_pay
      } else {
        return acc + timesheet.rate
      }
    }, 0)

    const columns = await this.resolverColumns(resultTemplate, newTimesheets, createInvoiceDto)

    const fonts = {
      Roboto: {
        normal: mp('Poppins-Regular.ttf'),
        bold: mp('Poppins-Bold.ttf'),
      },
    }

    const printer = new PdfPrinter(fonts)

    const headerDefinitions = []

    const keys = Object.keys(columns)
    const values = {}

    for (const index in keys) {
      const headerName = keys[Number(index)]
      headerDefinitions.push({ text: headerName, style: 'tableHeader' })

      columns[headerName].rows?.forEach((row, rowIndex) => {
        if (!values[rowIndex]) {
          values[rowIndex] = []
        }

        values[rowIndex].push({ text: row === 'null ' ? 'N/A' : row.trim(), alignment: 'left' })
      })
    }

    const valuesDefinitions = Object.values(values)

    const docDefinition: any = {
      pageSize: 'A3',
      pageOrientation: 'landscape',
      defaultStyle: {
        fontSize: 9,
      },
      header: {
        columns: [
          {
            image: mp('logo-black.jpg'),
            width: 100,
            margin: [30, 0, 20, 60],
          },
          {
            text: 'Invoice',
            style: 'invoiceTitle',
            alignment: 'right',
            margin: [0, 15, 40, 60],
          },
        ],
      },

      footer: (currentPage: number, pageCount: number) => {
        return {
          columns: [
            {
              text: `Página ${currentPage} de ${pageCount}`,
              alignment: 'right',
              margin: [0, 0, 40, 0],
              style: 'footerPage',
            },
          ],
        }
      },

      content: [
        {
          columns: [
            {
              width: '50%',
              stack: [
                { text: 'Sipena Logistic', style: 'companyName' },
                { text: '+61 481785097\ninfo@sipenalogistics.com.au', style: 'address' },
              ],
            },
            {
              width: '50%',
              stack: [
                {
                  text: [{ text: 'Invoice No: ', bold: true }, `INV-${createInvoiceDto.invoice_number}\n`],
                  alignment: 'right',
                },
                {
                  text: [{ text: 'Ref: ', bold: true }, `${createInvoiceDto.reference_week}\n`],
                  alignment: 'right',
                },
                {
                  text: [{ text: 'Date Issued: ', bold: true }, DateTime.now().toFormat('dd/MM/yyyy'), '\n'],
                  alignment: 'right',
                },
              ],
            },
          ],
          margin: [0, 20, 0, 20],
        },

        {
          columns: [
            {
              width: '50%',
              stack: [
                { text: createInvoiceDto.type, style: 'sectionHeader' },
                {
                  text: [
                    { text: `${dataUser.name} ${dataUser.last_name}\n`, bold: true, margin: [0, 0, 0, 5] },
                    `Address: ${dataUser?.infoworker?.address || 'No information'}\n`,
                    `Phone: ${dataUser?.infoworker?.phone || 'No information'}\n`,
                    `Email: ${dataUser?.email || 'No information'}\n`,
                    `ABN: ${dataUser?.infoworker?.abn || 'No information'}`,
                  ],
                },
              ],
            },
          ],
          margin: [0, 0, 0, 20],
        },

        {
          text: 'INVOICE ITEMS',
          style: 'sectionHeader',
          margin: [0, 0, 0, 10],
          fontSize: 10,
        },

        {
          style: 'tableExample',
          table: {
            widths: keys.map((_, index) => (index === 0 ? 'auto' : '*')),
            headerRows: 1,
            body: [headerDefinitions, ...valuesDefinitions],
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 20],
        },

        {
          columns: [
            {
              width: '*',
              text: '',
            },
            {
              width: 'auto',
              table: {
                body: [
                  [
                    { text: '$AUD Total:', bold: true, fontSize: 12 },
                    { text: `${parseFloat(total).toFixed(2)}`, alignment: 'right', fontSize: 12 },
                  ],
                ],
              },
              layout: 'noBorders',
            },
          ],
          margin: [0, 0, 0, 20],
        },

        {
          text: `Bank Transfer: (yours details),\n Bank name: ${timesheets.raw[0]?.infoworker_bank_name}\nAccount name: ${timesheets.raw[0]?.infoworker_bank_account_name},\nBSB: ${timesheets.raw[0]?.infoworker_bsb}\nAccount number: ${timesheets.raw[0]?.infoworker_bank_account_number}`,
          style: 'footerInfo',
          margin: [0, 20, 0, 0],
        },
      ],

      styles: {
        invoiceTitle: {
          fontSize: 14,
          bold: true,
          margin: [40, 10, 0, 0],
        },
        companyName: {
          fontSize: 14,
          bold: true,
        },
        address: {
          fontSize: 10,
          lineHeight: 1.2,
        },
        sectionHeader: {
          fontSize: 12,
          bold: true,
          margin: [0, 0, 0, 5],
        },
        tableHeader: {
          bold: true,
          fontSize: 10,
          fillColor: '#e8e8e8',
        },
        tableExample: {
          margin: [0, 5, 0, 15],
          fontSize: 10,
        },
        footerPage: {
          fontSize: 8,
          color: 'gray',
        },
        footerInfo: {
          fontSize: 9,
          color: 'gray',
        },
      },
    }

    const pdfDoc = printer.createPdfKitDocument(docDefinition)

    const buffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks = []
      pdfDoc.on('data', chunk => chunks.push(chunk))
      pdfDoc.on('end', () => resolve(Buffer.concat(chunks)))
      pdfDoc.on('error', reject)
      pdfDoc.end()
    })

    const downloadURL = await this.imageService.uploadOtherFiles(buffer, 'invoices', 'application/pdf')

    return downloadURL
  }

  private async resolverColumns(template, timesheets, body: CreateInvoiceDto) {
    const columns = {}

    const forceZeroFields = [
      'container_cartons',
      'container_skus',
      'container_weight',
      'container_pallets',
      'container_size_value',
    ]

    template.columns = template.columns.sort((a, b) => a.order - b.order)

    template.columns.forEach(column => {
      const valueCell = column.value_cell

      if (!columns[column.name]) {
        columns[column.name] = {
          rows: [],
        }
      }

      const formatHours = [
        'timesheet_workers_break',
        'timesheet_workers_waiting_time',
        'timesheet_workers_time',
        'timesheet_workers_time_out',
        'container_start',
        'container_finish',
      ]
      const formatDates = ['timesheet_day', 'invoice_date', 'due_date']

      timesheets.forEach(timesheet => {
        let valueReplacecell = valueCell?.replace(/@path:([\w.]+)/g, (match, p1) => {
          if (!p1.includes('_')) p1 = `timesheet_${p1}`

          const value = timesheet[p1]

          if (p1 === 'invoice_number') return `INV - ${body.invoice_number}`
          if (p1 === 'reference_week') return body.reference_week

          if (p1.includes('container_work')) p1 = p1.replace('container_work', 'work')

          if (p1 === 'container_size_value') return timesheet?.size_value || '0'
          if (p1 === 'number_of_workers') return timesheet?.number_of_workers
          if (p1 === 'container_product_name') return timesheet?.product_name || 'N/A'

          if (formatHours.includes(p1)) return DateTime.fromJSDate(value).toFormat('HH:mm')
          if (formatDates.includes(p1)) {
            return DateTime.fromJSDate(value).toFormat('dd/MM/yyyy')
          }

          if (value === null || value === undefined || value === '' || value === 'null ') {
            if (forceZeroFields.includes(p1)) {
              return '0'
            }
            return ''
          }

          return value.toString()
        })

        valueReplacecell = valueReplacecell.replace(/\b(null|undefined)\b/gi, '')
        valueReplacecell = valueReplacecell.replace(/\s{2,}/g, ' ').trim()
        valueReplacecell = valueReplacecell.replace(/-\s*-\s*/g, '- ').trim()
        valueReplacecell = valueReplacecell.replace(/^-\s*/, '').replace(/-\s*$/, '').trim()

        columns[column.name].rows.push(valueReplacecell)

        // this.timesheetService.closeTimesheet(timesheet.id)
      })
    })

    return columns
  }
}
