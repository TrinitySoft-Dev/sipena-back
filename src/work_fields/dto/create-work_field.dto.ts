import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateWorkFieldDto {
  @ApiProperty({
    type: 'string',
    description: 'Work field name',
  })
  @IsString()
  name: string

  @ApiProperty({
    type: 'string ',
    description: 'Work field description',
  })
  @IsOptional()
  @IsString()
  description: string

  @ApiProperty({
    type: 'string',
    description: 'Work field path',
  })
  @IsString()
  path: string
}
