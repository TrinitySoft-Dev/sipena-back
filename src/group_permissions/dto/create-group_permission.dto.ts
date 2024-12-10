import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsUUID } from 'class-validator'

export class CreateGroupPermissionDto {
  @ApiProperty({
    name: 'name',
    description: 'Name of the group permission',
    example: 'Admin',
  })
  @IsString()
  name: string

  @ApiProperty({
    name: 'permissions',
    description: 'Array of permissions ids',
    example: ['f7f9d1d0-4e1e-4b4d-8d9b-0a1e8d4e1a4e'],
  })
  @IsUUID('4', { each: true })
  permissions: string[]
}
