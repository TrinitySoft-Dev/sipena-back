import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'

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
  @IsOptional()
  customer: number

  @ApiProperty({
    example: '2021-01-01',
    description: 'The invoice date',
  })
  @IsOptional()
  @IsDateString()
  invoice_date: Date

  @ApiProperty({
    example: '2021-01-07',
    description: 'The due date',
  })
  @IsOptional()
  @IsDateString()
  due_date: Date

  @ApiProperty({
    example: 'CUSTOMER',
    description: 'The invoice status',
  })
  @IsEnum(['CUSTOMER', 'WORKER'])
  type: string

  @ApiProperty({
    example: 1,
    description: 'The template id',
  })
  @IsNumber()
  template: number
}
