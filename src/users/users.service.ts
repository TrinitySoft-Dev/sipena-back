import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'

import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { FindOneOptions, ILike, In, Repository } from 'typeorm'
import { InfoworkersService } from '@/infoworkers/infoworkers.service'
import { LoginUserDto } from './dto/login-user.dto'
import { ImagesService } from '@/images/images.service'
import { ROLES_CONST } from '@/common/conts/roles.const'
import { Response } from 'express'
import { EmailService } from '@/email/email.service'
import { config } from '@/common/config/config'
import { PasswordHashService } from '@/password_hash/password_hash.service'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { AccessJwtService } from '@/common/services/access-jwt.service'
import { AccessJwtRefreshService } from '@/common/services/refresh-jwt.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { RolesService } from '@/roles/roles.service'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly infoworkerService: InfoworkersService,
    private readonly jwtService: AccessJwtService,
    private readonly jwtRefreshService: AccessJwtRefreshService,
    private readonly imagesService: ImagesService,
    private readonly emailService: EmailService,
    private readonly passwordHashService: PasswordHashService,
    private readonly roleService: RolesService,
  ) {}

  async create(createUserDto: any, files: Express.Multer.File[]) {
    let { email, password, name, last_name, role, idRole, city, state, abn, ...rest } = createUserDto

    email = email.toLowerCase().trim()

    const existuser = await this.userRepository
      .createQueryBuilder('user')
      .where('(user.email = :email OR user.abn = :abn) AND user.active = :active', { email, abn, active: true })
      .getOne()
    if (existuser) throw new UnauthorizedException('Abn or email already exists')

    password = password ? createUserDto.password : Math.random().toString(36).substring(2, 15)
    const hashPassword = await this.encryptPassword(password)
    if (role === ROLES_CONST.WORKER || !role) {
      if (!role) role = ROLES_CONST.WORKER

      if (files.length == 2) {
        const passport_url = await this.imagesService.upload(files[0], 'passport')
        const visa_url = await this.imagesService.upload(files[1], 'visa')
        rest.visa_url = visa_url
        rest.passport_url = passport_url
      }

      const resRole = await this.roleService.findByName(role)
      const obj = {
        email,
        password: hashPassword,
        name,
        last_name,
        role: idRole ? { id: idRole } : resRole,
        city: city ? JSON.parse(city) : null,
        state: state ? JSON.parse(state) : null,
      }

      if (rest.create_type !== 'BASIC') {
        obj['infoworker'] = await this.infoworkerService.create({ ...rest })
      }

      const user = await this.userRepository.save(obj)

      if (user.infoworker) user.completed = true

      if (rest.create_type !== 'BASIC') {
        await this.emailService.send({
          template: 'create_user.html',
          email,
          data: {
            name,
            lastname: last_name,
            email,
            password,
          },
        })
      } else {
        await this.emailService.send({
          template: 'confirmation.html',
          email,
          data: {
            name,
            lastname: last_name,
          },
        })

        await this.emailService.sendAdmin({
          template: 'activate.html',
          data: {
            username: name,
            email,
            url: `${config.SIPENA_URI_FRONT}/app/worker/worker-list/${user.id}`,
          },
        })
      }

      return { message: 'User created successfully' }
    }

    const obj: Partial<User> = {
      email,
      password: hashPassword,
      name,
      last_name,
      role,
      city: city ? JSON.parse(city) : null,
      state: state ? JSON.parse(state) : null,
    }

    if (role === ROLES_CONST.CUSTOMER) {
      let { rules } = createUserDto
      rules = rules?.split(',').map(rule => ({
        id: Number(rule),
      }))
      if (rules?.length > 0) obj.rules = rules
      const resRole = await this.roleService.findByName(role)

      const user = await this.userRepository.save({
        ...obj,
        role: idRole ? { id: idRole } : resRole,
      })
      await this.userRepository.save(user)

      await this.emailService.send({
        template: 'create_user.html',
        email,
        data: {
          name,
          lastname: last_name,
          email,
          password,
        },
      })

      return { message: 'User created successfully' }
    }

    const resRole = await this.roleService.findByName(role)

    const user = this.userRepository.create({
      ...obj,
      role: idRole ? { id: idRole } : resRole,
    })
    await this.userRepository.save(user)
    await this.emailService.send({
      template: 'create_user.html',
      email,
      data: {
        name,
        lastname: last_name,
        email,
        password,
      },
    })

    return { message: 'User created successfully' }
  }

  async login(loginUserDto: LoginUserDto, response: Response) {
    const { email, password } = loginUserDto

    const user = await this.userRepository.findOne({
      where: { email: email.toLowerCase(), active: true },
      relations: ['infoworker', 'role', 'role.permissions', 'state'],
    })

    if (!user) throw new UnauthorizedException('Email or password incorrect')

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) throw new UnauthorizedException('Email or password incorrect')

    const permissions = user.role.permissions.map(permission => permission.name)

    const payload = {
      email: user.email.toLowerCase(),
      role: user.role.name,
      id: user.id,
      completedInfoworker: user.completed,
      name: user.name,
      lastname: user.last_name,
      avatar_url: user.avatar,
      permissions,
      state: user.state?.name,
    }

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
      relations: ['infoworker', 'role', 'role.permissions', 'state'],
    })
    if (!user) throw new UnauthorizedException('Email or password incorrect')

    const permissions = user.role.permissions.map(permission => permission.name)

    const payload = {
      email: user.email.toLowerCase(),
      role: user.role.name,
      id: user.id,
      completedInfoworker: user.completed,
      name: user.name,
      lastname: user.last_name,
      avatar_url: user.avatar,
      permissions,
      state: user?.state?.name,
    }

    const token = await this.jwtService.signAsync(payload)
    const newRefreshToken = await this.jwtRefreshService.signAsync(payload)

    return { token, newRefreshToken }
  }

  async findById(id: number) {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['infoworker', 'city', 'state'],
      select: ['id', 'active', 'email', 'role', 'completed', 'infoworker', 'name', 'last_name'],
    })
  }

  async forgotPasssword(email: string) {
    email = email.toLowerCase().trim()
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
    return await this.userRepository.find({ where: { id: In(ids), role: { name: ROLES_CONST.WORKER }, active: true } })
  }

  async findOne(options: FindOneOptions<User>) {
    return await this.userRepository.findOne(options)
  }

  async findByWorks(userId: number, workId: number, id: number) {
    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.rules', 'rule', 'rule.work = :workId', { workId })
      .leftJoinAndSelect('rule.condition_groups', 'condition_groups')
      .leftJoinAndSelect('condition_groups.conditions', 'conditions')
      .leftJoinAndSelect('rule.extra_rules', 'extra_rules')
      .leftJoinAndSelect('extra_rules.condition_groups', 'extra_condition_groups')
      .leftJoinAndSelect('extra_condition_groups.conditions', 'extra_conditions')
      .leftJoinAndSelect('user.normal_schedule', 'normal_schedule')
      .leftJoinAndSelect('normal_schedule.work', 'work')
      .leftJoinAndSelect('normal_schedule.overtimes', 'overtimes')
      .leftJoinAndSelect('rule.container_size', 'container_size')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.id = :userId', { userId })
      .andWhere('user.active = :active', { active: true })
      .andWhere('role.name = :role', { role: ROLES_CONST.CUSTOMER })

    if (id) {
      query.andWhere('container_size.id = :id', { id })
    }

    const user = await query.getOne()

    if (!user) throw new NotFoundException('User not found')
    return user
  }

  async findByRole({
    role,
    name,
    email,
    page,
    pageSize,
    includePagination,
    currentUser,
  }: {
    role: string
    name: string
    email: string
    page: number
    pageSize: number
    includePagination: boolean
    currentUser: any
  }) {
    const skip = page * pageSize
    let where: any = { role: { name: role } }
    const order = { created_at: 'DESC' as const }

    if (role === ROLES_CONST.WORKER && includePagination) {
      const [result, total] = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.infoworker', 'infoworker')
        .leftJoinAndSelect('user.role', 'role')
        .where('role.name = :role', { role })
        .andWhere(name ? '(user.name ILIKE :name OR user.last_name ILIKE :name)' : '1=1', { name: `%${name}%` })
        .andWhere(email ? 'user.email = :email' : '1=1', { email })
        .orderBy('user.created_at', 'DESC')
        .skip(skip)
        .take(pageSize)
        .getManyAndCount()

      return {
        result,
        pagination: {
          page,
          pageSize,
          total,
        },
      }
    }

    if (name) {
      where = [
        { name: ILike(`%${name}%`), ...where },
        { last_name: ILike(`%${name}%`), ...where },
      ]
    }

    if (email) {
      where.email = email
    }

    const options = {
      where,
      order,
      relations:
        role === ROLES_CONST.WORKER ? ['infoworker', 'timesheet_workers.timesheet.container'] : ['role', 'timesheets'],
    }

    if (role === ROLES_CONST.WORKER && !includePagination) {
      options.where = { ...where, completed: true }
    }

    if (currentUser?.role === ROLES_CONST.WORKER && role === ROLES_CONST.WORKER) {
      options.where = { ...where, state: { name: currentUser?.state } }
    }

    if (currentUser?.role === ROLES_CONST.WORKER && role === ROLES_CONST.CUSTOMER) {
      options.where = { ...where, state: { name: currentUser?.state } }
    }

    if (includePagination) {
      options['skip'] = skip
      options['take'] = pageSize
      const [result, total] = await this.userRepository.findAndCount(options)

      return {
        result,
        pagination: {
          page,
          pageSize,
          total,
        },
      }
    }

    const result = await this.userRepository.find(options)

    return result
  }

  async update(options) {
    const { id, updateUserDto, visa, passport } = options
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['infoworker', 'rules', 'role', 'role.permissions'],
    })

    if (!user) throw new NotFoundException('User not found')

    if (updateUserDto.role === ROLES_CONST.WORKER) {
      if (user?.infoworker) {
        Object.assign(user.infoworker, JSON.parse(updateUserDto.infoworker))
        if (visa) {
          const visa_url = await this.imagesService.upload(visa, 'visa')
          user.infoworker.visa_url = visa_url
        }

        if (passport) {
          const passport_url = await this.imagesService.upload(passport, 'passport')
          user.infoworker.passport_url = passport_url
        }
      } else {
        let visaUrl = null
        let passportUrl = null
        if (visa) {
          visaUrl = await this.imagesService.upload(visa)
        }
        if (passport) {
          passportUrl = await this.imagesService.upload(passport)
        }

        const infoworker = await this.infoworkerService.create({
          ...JSON.parse(updateUserDto.infoworker),
          visa_url: visaUrl,
          passport_url: passportUrl,
        })
        user.infoworker = infoworker
      }

      const isValid = await this.userRepository
        .createQueryBuilder('user')
        .innerJoin('user.infoworker', 'infoworker')
        .innerJoin('user.city', 'city')
        .innerJoin('user.state', 'state')
        .select('CASE WHEN COUNT(user.id) > 0 THEN TRUE ELSE FALSE END', 'isComplete')
        .where("infoworker.phone IS NOT NULL AND infoworker.phone != ''")
        .andWhere("infoworker.tfn IS NOT NULL AND infoworker.tfn != ''")
        .andWhere("infoworker.abn IS NOT NULL AND infoworker.abn != ''")
        .andWhere('infoworker.birthday IS NOT NULL')
        .andWhere("infoworker.passport_url IS NOT NULL AND infoworker.passport_url != ''")
        .andWhere("infoworker.address IS NOT NULL AND infoworker.address != ''")
        .andWhere("infoworker.bank_name IS NOT NULL AND infoworker.bank_name != ''")
        .andWhere("infoworker.bank_account_name IS NOT NULL AND infoworker.bank_account_name != ''")
        .andWhere("infoworker.bank_account_number IS NOT NULL AND infoworker.bank_account_number != ''")
        .andWhere("infoworker.postal_code IS NOT NULL AND infoworker.postal_code != ''")
        .andWhere("infoworker.bsb IS NOT NULL AND infoworker.bsb != ''")
        .andWhere("infoworker.visa_url IS NOT NULL AND infoworker.visa_url != ''")
        .andWhere('city.id IS NOT NULL')
        .andWhere('state.id IS NOT NULL')
        .getRawOne()

      user.completed = isValid.isComplete
      user.name = updateUserDto?.name ?? user.name
      user.last_name = updateUserDto?.last_name ?? user.last_name
      user.city = updateUserDto?.city ? JSON.parse(updateUserDto.city) : user.city
      user.state = updateUserDto?.state ? JSON.parse(updateUserDto.state) : user.state

      await this.userRepository.save(user)

      return { message: 'User updated successfully', user }
    }

    if (updateUserDto.role === ROLES_CONST.CUSTOMER || updateUserDto.role) {
      user.name = updateUserDto?.name ?? user.name
      user.last_name = updateUserDto?.last_name ?? user.last_name
      user.rules = updateUserDto?.rules
      user.normal_schedule = updateUserDto?.normal_schedule
      user.city = updateUserDto?.city ? JSON.parse(updateUserDto.city) : user.city
      user.state = updateUserDto?.state ? JSON.parse(updateUserDto.state) : user.state

      await this.userRepository.save(user)

      return { message: 'User updated successfully', user }
    }

    return { message: 'User updated successfully', user }
  }

  async updateStatus(id: number, active: boolean) {
    return this.userRepository.update(id, { active })
  }

  async updatePassword(id: number, oldPassword: string, newPassword: string) {
    const user = await this.userRepository.findOne({ where: { id } })

    if (!user) {
      throw new Error('User not found')
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password)
    if (!isMatch) {
      throw new Error('Old password is incorrect')
    }

    const hashedPassword = await this.encryptPassword(newPassword)

    return this.userRepository.update(id, { password: hashedPassword })
  }

  updateAvatar(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, { avatar: updateUserDto.avatar })
  }

  private async encryptPassword(password: string) {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    return hash
  }

  async delete(id: number) {
    return await this.userRepository.softDelete(id)
  }
}
