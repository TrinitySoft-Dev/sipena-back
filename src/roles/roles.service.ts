import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateRoleDto } from './dto/create-role.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Role } from './entities/role.entity'
import { ILike, Repository } from 'typeorm'

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

  async find({
    roleName,
    page,
    pageSize,
    includePagination,
  }: {
    roleName: string
    page: number
    pageSize: number
    includePagination: boolean
  }) {
    const whereCondition = roleName ? { name: ILike(`${roleName}%`) } : {}

    if (includePagination) {
      const [result, total] = await this.roleRepository.findAndCount({
        where: whereCondition,
        skip: page * pageSize,
        take: pageSize,
        order: {
          created_at: 'DESC',
        },
      })

      return { result, pagination: { page, pageSize, total } }
    }
    return this.roleRepository.find({ where: { status: true } })
  }

  async update(id: string, updateRoleDto: CreateRoleDto) {
    const role = await this.roleRepository.findOne({ where: { id } })
    if (!role) throw new NotFoundException('Role not found')

    Object.assign(role, updateRoleDto)
    return this.roleRepository.save(role)
  }

  async findById(id: string) {
    return this.roleRepository.findOne({ where: { id }, relations: ['permissions'] })
  }

  async delete(id: string) {
    return this.roleRepository.softDelete(id)
  }
}
