import { Module } from '@nestjs/common'
import { PasswordHashService } from './password_hash.service'
import { PasswordHashController } from './password_hash.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PasswordHash } from './entities/password_hash.entity'
import { AccessJwtService } from '@/common/services/access-jwt.service'

@Module({
  imports: [TypeOrmModule.forFeature([PasswordHash])],
  controllers: [PasswordHashController],
  providers: [PasswordHashService, AccessJwtService],
  exports: [PasswordHashService],
})
export class PasswordHashModule {}
