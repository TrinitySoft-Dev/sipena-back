import { Module } from '@nestjs/common'
import { ExtraRulesService } from './extra_rules.service'
import { ExtraRulesController } from './extra_rules.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ExtraRule } from './entities/extra_rule.entity'
import { AccessJwtService } from '@/common/services/access-jwt.service'

@Module({
  imports: [TypeOrmModule.forFeature([ExtraRule])],
  controllers: [ExtraRulesController],
  providers: [ExtraRulesService, AccessJwtService],
})
export class ExtraRulesModule {}
