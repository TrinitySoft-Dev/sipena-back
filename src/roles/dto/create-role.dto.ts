import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsBoolean, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator'

class PermissionDto {
  @ApiProperty({
    description: 'Permission id',
    example: 'd5e6f1a2-6e8b-4b7e-8d6a-1e6d4f1e6d4f',
  })
  @IsUUID()
  id: string
}

export class CreateRoleDto {
  @ApiProperty({
    description: 'Role name',
    example: 'Administrator',
  })
  @IsString()
  name: string

  @ApiProperty({
    description: 'Role description',
    example: 'This role has full access to the system',
  })
  @IsString()
  description: string

  @ApiProperty({
    description: 'Role status',
    example: true,
  })
  @IsBoolean()
  status: boolean

  @ApiProperty({
    description: 'Role permissions',
    type: [PermissionDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionDto)
  @IsOptional()
  permissions: PermissionDto[]
}
