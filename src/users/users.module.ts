import { forwardRef, Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { InfoworkersModule } from '@/infoworkers/infoworkers.module'
import { ImagesModule } from '@/images/images.module'
import { RulesModule } from '@/rules/rules.module'
import { EmailModule } from '@/email/email.module'
import { PasswordHashModule } from '@/password_hash/password_hash.module'
import { AccessJwtService } from '@/common/services/access-jwt.service'
import { AccessJwtRefreshService } from '@/common/services/refresh-jwt.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    InfoworkersModule,
    ImagesModule,
    forwardRef(() => RulesModule),
    EmailModule,
    PasswordHashModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, AccessJwtService, AccessJwtRefreshService],
  exports: [UsersService],
})
export class UsersModule {}
