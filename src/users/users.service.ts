import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'

import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { FindOneOptions, In, Repository } from 'typeorm'
import { InfoworkersService } from '@/infoworkers/infoworkers.service'
import { LoginUserDto } from './dto/login-user.dto'
import { JwtService } from '@nestjs/jwt'
import { ImagesService } from '@/images/images.service'
import { ROLES_CONST } from '@/common/conts/roles.const'
import { RulesService } from '@/rules/rules.service'
import { Response } from 'express'
import { EmailService } from '@/email/email.service'
import { config } from '@/common/config/config'
import { PasswordHashService } from '@/password_hash/password_hash.service'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { AccessJwtService } from '@/common/services/access-jwt.service'
import { AccessJwtRefreshService } from '@/common/services/refresh-jwt.service'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly infoworkerService: InfoworkersService,
    private readonly jwtService: AccessJwtService,
    private readonly jwtRefreshService: AccessJwtRefreshService,
    private readonly imagesService: ImagesService,
    @Inject(forwardRef(() => RulesService)) private readonly rulesService: RulesService,
    private readonly emailService: EmailService,
    private readonly passwordHashService: PasswordHashService,
  ) {}

  async create(createUserDto: any, files: Express.Multer.File[]) {
    let { email, password, name, last_name, role, ...rest } = createUserDto

    const existuser = await this.userRepository.findOne({ where: { email, active: true } })
    if (existuser) throw new UnauthorizedException('Email already exists')

    password = password ? createUserDto.password : Math.random().toString(36).substring(2, 15)
    const hashPassword = await this.encryptPassword(password)

    if (role === ROLES_CONST.WORKER || !role) {
      if (files.length == 2) {
        const [passport_url, visa_url] = await this.imagesService.uploadMultiple(files)
        rest.visa_url = visa_url
        rest.passport_url = passport_url
      }

      const obj = {
        email,
        password: hashPassword,
        name,
        last_name,
        role,
      }

      rest.city = rest.city ? { id: rest.city } : null
      rest.state = rest.state ? { id: rest.state } : null

      if (rest.create_type !== 'BASIC') obj['infoworker'] = await this.infoworkerService.create({ ...rest })

      await this.userRepository.save(obj)
      await this.emailService.send({
        template: 'confirmation.html',
        email,
        data: {
          name,
          lastname: last_name,
        },
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
      rules = rules?.split(',').map(rule => ({
        id: Number(rule),
      }))
      if (rules?.length > 0) obj.rules = rules

      const user = await this.userRepository.save(obj)
      await this.userRepository.save(user)

      await this.emailService.send({
        template: 'confirmation.html',
        email,
        data: {
          name,
          lastname: last_name,
        },
      })
      return { message: 'User created successfully' }
    }

    const user = this.userRepository.create(obj)
    await this.userRepository.save(user)
    await this.emailService.send({
      template: 'confirmation.html',
      email,
      data: {
        name,
        lastname: last_name,
      },
    })

    return { message: 'User created successfully' }
  }

  async login(loginUserDto: LoginUserDto, response: Response) {
    const { email, password } = loginUserDto

    const user = await this.userRepository.findOne({ where: { email, active: true }, relations: ['infoworker'] })

    if (!user) throw new UnauthorizedException('Email or password incorrect')

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) throw new UnauthorizedException('Email or password incorrect')

    let completed = true
    if (user.role === ROLES_CONST.WORKER) {
      completed = this.infoworkerService.validateInfoworker(user.infoworker)
    }

    const payload = { email: user.email, role: user.role, id: user.id, completedInfoworker: completed }

    const token = await this.jwtService.signAsync(payload)
    const refreshToken = await this.jwtRefreshService.signAsync(payload)

    const expires = new Date(Date.now() + 1000 * 60 * 60 * 5)

    response.cookie('x-auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires,
    })

    response.cookie('x-refresh-token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires,
    })

    return { message: 'Login successfully' }
  }

  async refreshToken(refreshToken: string) {
    const validToken = await this.jwtRefreshService.verifyAsync(refreshToken)
    const user = await this.userRepository.findOne({
      where: { email: validToken.email, active: true },
      relations: ['infoworker'],
    })
    if (!user) throw new UnauthorizedException('Email or password incorrect')

    let completed = true
    if (user.role === ROLES_CONST.WORKER) {
      completed = this.infoworkerService.validateInfoworker(user.infoworker)
    }

    const payload = { email: user.email, role: user.role, id: user.id, completedInfoworker: completed }

    const token = await this.jwtService.signAsync(payload)
    const newRefreshToken = await this.jwtRefreshService.signAsync(payload)

    return { token, newRefreshToken }
  }

  async findById(id: number) {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['infoworker'],
      select: ['id', 'email', 'role', 'completed', 'infoworker', 'name', 'last_name'],
    })
  }

  async forgotPasssword(email: string) {
    const user = await this.userRepository.findOne({ where: { email } })
    if (!user) throw new NotFoundException('User not found')

    const token = crypto.randomBytes(64).toString('hex')
    const expires = new Date()
    expires.setMinutes(expires.getMinutes() + 5)

    this.passwordHashService.create({
      token,
      userId: user.id,
      expires,
    })

    const link = `${config.SIPENA_URI_FRONT}/reset-password?token=${token}`

    await this.emailService.send({
      template: 'forgot_password.html',
      email,
      data: {
        name: user.name,
        last_name: user.last_name,
        link,
      },
    })

    return { message: 'Email sent successfully' }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const hashedToken = this.passwordHashService.hastToken(resetPasswordDto.token)

    const token = await this.passwordHashService.findByHash(hashedToken)
    if (!token || token.expires < new Date()) throw new BadRequestException('Invalid token')

    const user = await this.userRepository.findOne({ where: { id: token.userId } })
    user.password = bcrypt.hashSync(resetPasswordDto.newPassword, 10)
    await this.userRepository.save(user)

    await this.passwordHashService.removeByHash(hashedToken)

    return { message: 'Password reset successfully' }
  }

  async findWorkers(ids: number[]) {
    return await this.userRepository.find({ where: { id: In(ids), role: ROLES_CONST.WORKER, active: true } })
  }

  async findOne(options: FindOneOptions<User>) {
    return await this.userRepository.findOne(options)
  }

  async findByWorks(userId: number, workId: number) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.rules', 'rule', 'rule.work = :workId', { workId })
      .leftJoinAndSelect('rule.condition_groups', 'condition_groups')
      .leftJoinAndSelect('condition_groups.conditions', 'conditions')
      .leftJoinAndSelect('rule.extra_rules', 'extra_rules')
      .leftJoinAndSelect('extra_rules.condition_groups', 'extra_condition_groups')
      .leftJoinAndSelect('extra_condition_groups.conditions', 'extra_conditions')
      .where('user.id = :userId', { userId })
      .andWhere('user.active = :active', { active: true })
      .andWhere('user.role = :role', { role: ROLES_CONST.CUSTOMER })
      .getOne()

    if (!user) throw new NotFoundException('User not found')
    return user
  }

  async findByRole(role: string) {
    if (role === ROLES_CONST.WORKER) {
      const res = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.infoworker', 'infoworker')
        .where('user.role = :role', { role })
        .andWhere('user.active = :active', { active: true })
        .getMany()

      return res
    }

    return await this.userRepository.find({ where: { role, active: true } })
  }

  async update(id: number, updateUserDto: any) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['infoworker', 'rules'],
    })

    if (!user) throw new NotFoundException('User not found')

    if (updateUserDto.role === ROLES_CONST.WORKER) {
      if (user?.infoworker) {
        Object.assign(user.infoworker, updateUserDto.infoworker)
      } else {
        const infoworker = await this.infoworkerService.create(updateUserDto.infoworker)
        user.infoworker = infoworker
      }

      user.name = updateUserDto?.name ?? user.name
      user.last_name = updateUserDto?.last_name ?? user.last_name
      user.role = updateUserDto?.role ?? user.role

      await this.userRepository.save(user)

      return { message: 'User updated successfully' }
    }

    if (updateUserDto.role === ROLES_CONST.CUSTOMER || updateUserDto.role) {
      user.name = updateUserDto?.name ?? user.name
      user.last_name = updateUserDto?.last_name ?? user.last_name
      user.role = updateUserDto?.role ?? user.role
      user.rules = updateUserDto?.rules

      await this.userRepository.save(user)

      return { message: 'User updated successfully' }
    }

    return { message: 'User updated successfully' }
  }

  private async encryptPassword(password: string) {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    return hash
  }
}
