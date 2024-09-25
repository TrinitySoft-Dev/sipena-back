import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNumber, IsString } from 'class-validator'

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
  @IsString()
  item_code: string

  @ApiProperty({
    description: 'Estado del producto, si está activo o no',
    example: true,
  })
  @IsBoolean()
  active: boolean
}
