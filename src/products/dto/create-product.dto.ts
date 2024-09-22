import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Product name',
  })
  @IsString()
  name: string

  @ApiProperty({
    description: 'Product price',
  })
  @IsNumber()
  price: number

  @ApiProperty({
    description: 'Product item code',
    example: '123456789',
  })
  @IsString()
  item_code: string

  @ApiProperty({
    description: 'Customer id',
    example: 1,
  })
  @IsNumber()
  customer: number

  @ApiProperty({
    description: 'Status of the product',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  active: boolean
}
