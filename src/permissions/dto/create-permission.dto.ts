import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreatePermissionDto {
  @ApiProperty({
    description: 'Permission name',
    example: 'CREATE_USER',
  })
  @IsString()
  name: string
}
