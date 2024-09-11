import { Injectable, UnauthorizedException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { InfoworkersService } from '@/infoworkers/infoworkers.service'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly infoworkerService: InfoworkersService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password, name, last_name, role, ...rest } = createUserDto

    const existuser = await this.userRepository.findOne({ where: { email } })
    if (existuser) throw new UnauthorizedException('Email already exists')

    const hashPassword = await this.encryptPassword(password)
    if (role === 'WORKER') {
      const infoworker = await this.infoworkerService.create({ ...rest })
      return await this.userRepository.save({
        email,
        password: hashPassword,
        name,
        last_name,
        role,
        infoworker,
      })
    }

    return await this.userRepository.save({
      email,
      password: hashPassword,
      name,
      last_name,
      role,
    })
  }

  async encryptPassword(password: string) {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    return hash
  }
}
