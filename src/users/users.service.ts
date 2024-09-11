import { Injectable, UnauthorizedException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { InfoworkersService } from '@/infoworkers/infoworkers.service'
import { LoginUserDto } from './dto/login-user.dto'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly infoworkerService: InfoworkersService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password, name, last_name, role, ...rest } = createUserDto

    const existuser = await this.userRepository.findOne({ where: { email } })
    if (existuser) throw new UnauthorizedException('Email already exists')

    const hashPassword = await this.encryptPassword(password)
    if (role === 'WORKER') {
      const infoworker = await this.infoworkerService.create({ ...rest })
      await this.userRepository.save({
        email,
        password: hashPassword,
        name,
        last_name,
        role,
        infoworker,
      })

      return { message: 'User created successfully' }
    }

    await this.userRepository.save({
      email,
      password: hashPassword,
      name,
      last_name,
      role,
    })

    return { message: 'User created successfully' }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto

    const user = await this.userRepository.findOne({ where: { email } })

    if (!user) throw new UnauthorizedException('Email or password incorrect')

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) throw new UnauthorizedException('Email or password incorrect')

    const payload = { email: user.email }

    const token = await this.jwtService.signAsync(payload)
    return { token }
  }

  async encryptPassword(password: string) {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    return hash
  }
}
