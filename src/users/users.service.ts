import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { InfoworkersService } from '@/infoworkers/infoworkers.service'
import { LoginUserDto } from './dto/login-user.dto'
import { JwtService } from '@nestjs/jwt'
import { ImagesService } from '@/images/images.service'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly infoworkerService: InfoworkersService,
    private readonly jwtService: JwtService,
    private readonly imagesService: ImagesService,
  ) {}

  async create(createUserDto: any, files: Express.Multer.File[]) {
    const { email, password, name, last_name, role, ...rest } = createUserDto

    const existuser = await this.userRepository.findOne({ where: { email, active: true } })
    if (existuser) throw new UnauthorizedException('Email already exists')

    const hashPassword = await this.encryptPassword(password)
    if (role === 'WORKER') {
      const [passport, visa] = await this.imagesService.uploadMultiple(files)

      const infoworker = await this.infoworkerService.create({ ...rest, visa, passport })
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

    const user = await this.userRepository.findOne({ where: { email, active: true } })

    if (!user) throw new UnauthorizedException('Email or password incorrect')

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) throw new UnauthorizedException('Email or password incorrect')

    const payload = { email: user.email }

    const token = await this.jwtService.signAsync(payload)
    return { token }
  }

  async findById(id: number) {
    return await this.userRepository.findOne({ where: { id } })
  }

  async findByRole(role: string) {
    const res = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.infoworker', 'infoworker')
      .select([
        'user.id',
        'user.email',
        'user.name',
        'user.last_name',
        'user.role',
        'user.active',
        'user.created_at',
        'user.updated_at',
        'user.deleted_at',
        'infoworker.phone',
        'infoworker.tfn',
        'infoworker.abn',
        'infoworker.birthday',
        'infoworker.employment_end_date',
        'infoworker.passport',
        'infoworker.address',
        'infoworker.city',
        'infoworker.active',
        'infoworker.visa',
      ])
      .where('user.role = :role', { role })
      .andWhere('user.active = :active', { active: true })
      .getMany()
    return res
  }

  async encryptPassword(password: string) {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    return hash
  }
}
