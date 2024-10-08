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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly infoworkerService: InfoworkersService,
    private readonly jwtService: JwtService,
    private readonly imagesService: ImagesService,
    @Inject(forwardRef(() => RulesService)) private readonly rulesService: RulesService,
    private readonly emailService: EmailService,
    private readonly passwordHashService: PasswordHashService,
  ) {}

  async create(createUserDto: any, files: Express.Multer.File[]) {
    const { email, password, name, last_name, role, ...rest } = createUserDto

    const existuser = await this.userRepository.findOne({ where: { email, active: true } })
    if (existuser) throw new UnauthorizedException('Email already exists')

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

    const user = await this.userRepository.findOne({ where: { email, active: true } })

    if (!user) throw new UnauthorizedException('Email or password incorrect')

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) throw new UnauthorizedException('Email or password incorrect')

    const payload = { email: user.email, role: user.role, id: user.id }

    const token = await this.jwtService.signAsync(payload)

    const expires = new Date(Date.now() + 1000 * 60 * 60 * 5)

    response.cookie('x-auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires,
    })

    return { message: 'Login successfully' }
  }

  async findById(id: number) {
    return await this.userRepository.findOne({ where: { id } })
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

    return await this.userRepository.find({ where: { role, active: true } })
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
