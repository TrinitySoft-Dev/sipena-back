import { Module } from '@nestjs/common'
import { StateService } from './state.service'
import { StateController } from './state.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { State } from './entities/state.entity'
import { AccessJwtService } from '@/common/services/access-jwt.service'

@Module({
  imports: [TypeOrmModule.forFeature([State])],
  controllers: [StateController],
  providers: [StateService, AccessJwtService],
})
export class StateModule {}
