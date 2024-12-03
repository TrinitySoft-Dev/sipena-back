import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsNumber, IsString } from 'class-validator'

export class CreateInvoiceDto {
  @ApiProperty({
    example: 'INV-0001',
    description: 'The invoice number',
  })
  @IsString()
  invoice_number: string

  @ApiProperty({
    example: '2021-01-01 / 2021-01-07',
    description: 'The reference week',
  })
  @IsString()
  reference_week: string

  @ApiProperty({
    example: 1,
    description: 'The customer id',
  })
  @IsString()
  customer: number

  @ApiProperty({
    example: '2021-01-01',
    description: 'The invoice date',
  })
  @IsDateString()
  invoice_date: Date

  @ApiProperty({
    example: '2021-01-07',
    description: 'The due date',
  })
  @IsDateString()
  due_date: Date

  @ApiProperty({
    example: 1,
    description: 'The template id',
  })
  @IsNumber()
  template: number
}
