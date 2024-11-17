import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

class StateDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p',
    description: 'The UUID of the state',
  })
  @IsUUID()
  id: string
}

export class CreateCityDto {
  @ApiProperty({
    example: 'New York',
    description: 'The name of the city',
    required: true,
  })
  @IsString()
  name: string

  @ApiProperty({
    type: StateDto,
    description: 'The state information for the city',
    required: true,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => StateDto)
  state: StateDto
}
