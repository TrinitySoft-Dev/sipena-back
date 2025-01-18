import { Module } from '@nestjs/common'
import { RolesService } from './roles.service'
import { RolesController } from './roles.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Role } from './entities/role.entity'
import { AccessJwtService } from '@/common/services/access-jwt.service'

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RolesController],
  providers: [RolesService, AccessJwtService],
  exports: [RolesService],
})
export class RolesModule {}
