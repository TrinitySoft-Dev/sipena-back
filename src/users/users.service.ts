import { BadRequestException, forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { FindOneOptions, In, Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { InfoworkersService } from '@/infoworkers/infoworkers.service'
import { LoginUserDto } from './dto/login-user.dto'
import { JwtService } from '@nestjs/jwt'
import { ImagesService } from '@/images/images.service'
import { ROLES_CONST } from '@/common/conts/roles.const'
import { RulesService } from '@/rules/rules.service'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly infoworkerService: InfoworkersService,
    private readonly jwtService: JwtService,
    private readonly imagesService: ImagesService,
    @Inject(forwardRef(() => RulesService)) private readonly rulesService: RulesService,
  ) {}

  async create(createUserDto: any, files: Express.Multer.File[]) {
    const { email, password, name, last_name, role, ...rest } = createUserDto

    const existuser = await this.userRepository.findOne({ where: { email, active: true } })
    if (existuser) throw new UnauthorizedException('Email already exists')

    const hashPassword = await this.encryptPassword(password)

    if (role === ROLES_CONST.WORKER) {
      if (files.length !== 2) throw new BadRequestException('Invalid files')
      const [passport_url, visa_url] = await this.imagesService.uploadMultiple(files)

      const infoworker = await this.infoworkerService.create({ ...rest, visa_url, passport_url })
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

    const obj: Partial<User> = {
      email,
      password: hashPassword,
      name,
      last_name,
      role,
    }

    if (role === ROLES_CONST.CUSTOMER) {
      let { rules } = createUserDto
      rules = rules?.split(',').map(Number)

      if (rules?.length > 0) {
        let allRules = await this.rulesService.findById(rules)
        if (allRules.length !== rules.length) throw new UnauthorizedException('Rules not found')

        obj.rules = allRules
      }

      const user = await this.userRepository.save(obj)
      await this.userRepository.save(user)

      return { message: 'User created successfully' }
    }

    const user = this.userRepository.create(obj)
    await this.userRepository.save(user)

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

  async findWorkers(ids: number[]) {
    return await this.userRepository.find({ where: { id: In(ids), role: ROLES_CONST.WORKER, active: true } })
  }

  async findOne(options: FindOneOptions<User>) {
    return await this.userRepository.findOne(options)
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

  async update(id: number, updateUserDto: any) {
    if (updateUserDto.role === ROLES_CONST.CUSTOMER) {
      const { rules, ...rest } = updateUserDto

      const allRules = await this.rulesService.findById(rules)

      if (allRules.length !== rules.length) throw new UnauthorizedException('Rules not found')

      await this.userRepository.update({ id }, { ...rest, rules: allRules })

      return { message: 'User updated successfully' }
    }

    await this.userRepository.update({ id }, updateUserDto)

    return {
      message: 'User updated successfully',
    }
  }

  private async encryptPassword(password: string) {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    return hash
  }
}
