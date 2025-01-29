import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateInvoiceDto } from './dto/create-invoice.dto'
import { TimesheetService } from '@/timesheet/timesheet.service'
import { TemplateService } from '@/template/template.service'
import * as excel4node from 'excel4node'
import { Readable } from 'stream'
import { ImagesService } from '@/images/images.service'
import { TimesheetStatusEnum } from '@/timesheet/entities/timesheet.entity'
import { DateTime } from 'luxon'
import * as path from 'node:path'
import PdfPrinter from 'pdfmake'
import { UsersService } from '@/users/users.service'

function mp(relFontPath) {
  const __currentDirname = path.resolve()
  return path.join(__currentDirname, relFontPath)
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
    const { reference_week, customer, invoice_number } = createInvoiceDto
    let timesheets: any = await this.timesheetService.findTimesheetsByWeek(
      reference_week,
      customer,
      createInvoiceDto.type,
    )

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

    const columns = await this.resolverColumns(resultTemplate, newTimesheets, createInvoiceDto)

    const fonts = {
      Roboto: {
        normal: mp('./src/fonts/Poppins-Regular.ttf'),
        bold: mp('./src/fonts/Poppins-Bold.ttf'),
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
            image: mp('./public/logo-black.jpg'),
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
            widths: keys.map(() => '*'),
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
                    { text: 'Total HT:', bold: true },
                    { text: '€ 7036.99', alignment: 'right' },
                  ],
                  [
                    { text: 'Total VAT:', bold: true },
                    { text: '€ 1547.324569', alignment: 'right' },
                  ],
                  [
                    { text: 'VAT(21.3%):', bold: true },
                    { text: '€ 1231.79', alignment: 'right' },
                  ],
                  [
                    { text: 'Total:', bold: true },
                    { text: '€ 8276.78', alignment: 'right' },
                  ],
                ],
              },
              layout: 'noBorders',
            },
          ],
          margin: [0, 0, 0, 20],
        },

        {
          text: 'Date: 03/03/2023',
          style: 'footerInfo',
        },

        {
          text: 'Drongo, Capital 1000, SIRET: 901062320001\nVAT: FR901023202, Activity Type: 58.29C\nRCS: 90106222 Paris 8',
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

      timesheets.forEach(timesheet => {
        let valueReplacecell = valueCell?.replace(/@path:([\w.]+)/g, (match, p1) => {
          if (p1 === 'invoice_number') {
            return `INV - ${body.invoice_number}`
          }
          if (p1 === 'reference_week') {
            return body.reference_week
          }
          if (p1 === 'invoice_date') {
            return DateTime.fromISO(body.invoice_date.toString()).toFormat('dd/MM/yyyy')
          }
          if (p1 === 'due_date') {
            return DateTime.fromISO(body.due_date.toString()).toFormat('dd/MM/yyyy')
          }
          if (p1.includes('container_work')) {
            p1 = p1.replace('container_work', 'work')
          }

          const value = timesheet[p1]

          if (p1.includes('timesheet_day') && value) {
            return DateTime.fromJSDate(value).toFormat('dd/MM/yyyy')
          }

          if ((p1.includes('container_start') || p1.includes('container_end')) && value) {
            return DateTime.fromJSDate(value).toFormat('HH:mm')
          }

          if (p1 === 'number_of_workers') {
            return timesheet?.number_of_workers
          }

          if (value === null || value === undefined || value === '' || value.trim() === 'null') {
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

        this.timesheetService.closeTimesheet(timesheet.id)
      })
    })

    return columns
  }
}
