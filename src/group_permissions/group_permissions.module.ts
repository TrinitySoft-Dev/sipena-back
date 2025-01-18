import { Module } from '@nestjs/common'
import { GroupPermissionsService } from './group_permissions.service'
import { GroupPermissionsController } from './group_permissions.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GroupPermission } from './entities/group_permission.entity'
import { AccessJwtService } from '@/common/services/access-jwt.service'

@Module({
  imports: [TypeOrmModule.forFeature([GroupPermission])],
  controllers: [GroupPermissionsController],
  providers: [GroupPermissionsService, AccessJwtService],
})
export class GroupPermissionsModule {}
