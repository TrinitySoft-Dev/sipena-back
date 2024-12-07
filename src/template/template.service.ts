import { Injectable } from '@nestjs/common'
import { CreateTemplateDto } from './dto/create-template.dto'
import getSelectedFieldsWithPaths from '@/common/helpers/getAllSelectedFields'
import { Timesheet } from '@/timesheet/entities/timesheet.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Template } from './entities/template.entity'
import { Repository } from 'typeorm'
import { DateTime } from 'luxon'

@Injectable()
export class TemplateService {
  constructor(@InjectRepository(Template) private readonly templateRepository: Repository<Template>) {}

  create(createTemplateDto: CreateTemplateDto) {
    return this.templateRepository.save(createTemplateDto)
  }

  findOne(id: number) {
    return this.templateRepository.findOne({ where: { id }, relations: ['columns'] })
  }

  fields() {
    return getSelectedFieldsWithPaths(Timesheet)
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
          value_cell: '',
        },
        {
          name: 'Reference',
          value_cell: '',
        },
        {
          name: '*InvoiceDate',
          value_cell: '',
        },
        {
          name: '*DueDate',
          value_cell: '',
        },
        {
          name: 'InventoryItemCode',
          value_cell: '',
        },
        {
          name: '*Description',
          value_cell: `Date: ${DateTime.now().toFormat('yyyy-MM-dd')} \n DATTS - 20FT CONTAINER (500-999 CTNS, 10 SKUS) NO DRIVER \n Container: @path:container_container_number \n Product: @path:product_name`,
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
}
