import { CreateWorkFieldDto } from '@/work_fields/dto/create-work_field.dto'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator'

export class CreateWorkDto {
  @ApiProperty({
    description: 'Work name',
    example: 'General labor',
  })
  @IsString()
  name: string

  @ApiProperty({
    description: 'Work code',
    example: 'GL',
  })
  @IsString()
  code: string

  @ApiProperty({
    description: 'Work description',
    example: [
      {
        id: '1',
        isVisible: true,
        position: 1,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Fields)
  fields: Fields[]
}

class Fields {
  @ApiProperty({
    description: 'Work field id',
    example: '1',
  })
  @IsString()
  id: string

  @ApiProperty({
    description: 'Work field visibility',
    example: true,
  })
  @IsBoolean()
  isVisible: boolean

  @ApiProperty({
    description: 'Work field position',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  position: number
}
