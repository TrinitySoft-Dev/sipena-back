import { Injectable } from '@nestjs/common'
import { CreateRoleDto } from './dto/create-role.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Role } from './entities/role.entity'
import { Repository } from 'typeorm'

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Role) private readonly roleRepository: Repository<Role>) {}

  async create(createRoleDto: CreateRoleDto) {
    return this.roleRepository.save(createRoleDto)
  }

  async findByName(name: string) {
    if (!name) {
      return null
    }
    return this.roleRepository.findOne({ where: { name } })
  }

  async find() {
    return this.roleRepository.find({ where: { status: true } })
  }
}
