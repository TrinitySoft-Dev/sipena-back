import { Module } from '@nestjs/common'
import { GroupPermissionsService } from './group_permissions.service'
import { GroupPermissionsController } from './group_permissions.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GroupPermission } from './entities/group_permission.entity'

@Module({
  imports: [TypeOrmModule.forFeature([GroupPermission])],
  controllers: [GroupPermissionsController],
  providers: [GroupPermissionsService],
})
export class GroupPermissionsModule {}
