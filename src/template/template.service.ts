import { Injectable } from '@nestjs/common'
import { CreateTemplateDto } from './dto/create-template.dto'
import getSelectedFieldsWithPaths from '@/common/helpers/getAllSelectedFields'
import { Timesheet } from '@/timesheet/entities/timesheet.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Template } from './entities/template.entity'
import { Repository } from 'typeorm'
import { DateTime } from 'luxon'
import { UpdateTemplateDto } from './dto/update-template.dto'

@Injectable()
export class TemplateService {
  constructor(@InjectRepository(Template) private readonly templateRepository: Repository<Template>) {}

  create(createTemplateDto: CreateTemplateDto) {
    return this.templateRepository.save(createTemplateDto)
  }

  async update(id: number, updateTemplateDto: UpdateTemplateDto) {
    const template = await this.templateRepository.findOne({ where: { id }, relations: ['columns'] })
    Object.assign(template, updateTemplateDto)
    return this.templateRepository.save(template)
  }

  findOne(id: number) {
    return this.templateRepository.findOne({
      where: { id },
      relations: ['columns'],
      order: {
        columns: {
          name: 'ASC',
        },
      },
    })
  }

  async find(page, pageSize) {
    const [result, total] = await this.templateRepository.findAndCount({
      skip: page * pageSize,
      take: pageSize,
      relations: ['columns'],
      order: {
        created_at: 'DESC',
      },
    })

    return { result, pagination: { page, pageSize, total } }
  }

  async findSelect() {
    return this.templateRepository.find({ select: ['id', 'name'] })
  }

  fields() {
    const otherEntities = [
      { label: 'invoice_number', path: 'invoice_number' },
      { label: 'reference_week', path: 'reference_week' },
      { label: 'invoice_date', path: 'invoice_date' },
      { label: 'due_date', path: 'due_date' },
      { label: 'number_of_workers', path: 'number_of_workers' },
    ]
    const fields = getSelectedFieldsWithPaths(Timesheet).concat(otherEntities)
    return fields
  }

  createDefaultTemplate() {
    const obj = {
      name: 'Default template',
      columns: [
        {
          name: '*ContactName',
          value_cell: '@path:customer_name @path:customer_last_name',
        },
        {
          name: 'EmailAddress',
          value_cell: '',
        },
        {
          name: 'POAddressLine1',
          value_cell: '',
        },
        {
          name: 'POAddressLine2',
          value_cell: '',
        },
        {
          name: 'POAddressLine3',
          value_cell: '',
        },
        {
          name: 'POAddressLine4',
          value_cell: '',
        },
        {
          name: 'POCity',
          value_cell: '',
        },
        {
          name: 'PORegion',
          value_cell: '',
        },
        {
          name: 'POPostalCode',
          value_cell: '',
        },
        {
          name: 'POCountry',
          value_cell: '',
        },
        {
          name: '*Invoice Number',
          value_cell: '@path:invoice_number',
        },
        {
          name: 'Reference',
          value_cell: '@path:week',
        },
        {
          name: '*InvoiceDate',
          value_cell: '@path:invoice_date',
        },
        {
          name: '*DueDate',
          value_cell: '@path:due_date',
        },
        {
          name: 'InventoryItemCode',
          value_cell: '',
        },
        {
          name: '*Description',
          value_cell: `Date: ${DateTime.now().toFormat('yyyy-MM-dd')} \n @path:item_code \n Container: @path:container_container_number \n Product: @path:product_name`,
        },
        {
          name: '*Quantity',
          value_cell: '1',
        },
        {
          name: '*UnitAmount',
          value_cell: '@path:rate',
        },
        {
          name: 'Discount',
          value_cell: '',
        },
        {
          name: '*AccountCode',
          value_cell: '200',
        },
        {
          name: '*TaxType',
          value_cell: 'GST on Income',
        },
        {
          name: 'TrackingName1',
          value_cell: '',
        },
        {
          name: 'TrackingOption1',
          value_cell: '',
        },
        {
          name: 'TrackingName2',
          value_cell: '',
        },
        {
          name: 'TrackingOption2',
          value_cell: '',
        },
        {
          name: 'Currency',
          value_cell: 'AUD',
        },
        {
          name: 'BrandingTheme',
          value_cell: '',
        },
        {
          name: 'Total_Linear',
          value_cell: '@path:rate',
        },
      ],
    }

    return this.templateRepository.save(obj)
  }

  async delete(id: number) {
    return await this.templateRepository.softDelete(id)
  }
}
