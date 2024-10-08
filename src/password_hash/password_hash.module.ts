import { Module } from '@nestjs/common'
import { PasswordHashService } from './password_hash.service'
import { PasswordHashController } from './password_hash.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PasswordHash } from './entities/password_hash.entity'

@Module({
  imports: [TypeOrmModule.forFeature([PasswordHash])],
  controllers: [PasswordHashController],
  providers: [PasswordHashService],
  exports: [PasswordHashService],
})
export class PasswordHashModule {}
