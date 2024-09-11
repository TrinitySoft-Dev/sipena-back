import { PartialType } from '@nestjs/mapped-types'
import { CreateUserDto } from './worker-user.dto'

export class UpdateUserDto extends PartialType(CreateUserDto) {}
