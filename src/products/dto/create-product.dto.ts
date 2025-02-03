import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator'

export class CreateProductDto {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Camiseta',
  })
  @IsString({ message: 'Debe ser un string' })
  name: string

  @ApiProperty({
    description: 'Precio del producto',
    example: 19.99,
  })
  @IsNumber()
  price: number

  @ApiProperty({
    description: 'Código del artículo',
    example: 'ABC123',
  })
  @IsOptional()
  @IsString()
  item_code: string

  @ApiProperty({
    description: 'ID del cliente',
    example: [{ id: 8 }],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomerArray)
  customers: CustomerArray[]

  @ApiProperty({
    description: 'Pago al trabajador',
    example: 10.0,
  })
  @IsNumber()
  pay_worker: number

  @ApiProperty({
    description: 'Estado del producto, si está activo o no',
    example: true,
  })
  @IsBoolean()
  active: boolean
}

class CustomerArray {
  @IsNumber()
  id: number
}
