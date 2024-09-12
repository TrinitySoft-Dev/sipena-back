import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'

// Ensure the necessary @nestjs/typeorm package is installed or the path is correctly set
import { config } from '@/common/config/config'

// modules
import { UsersModule } from './users/users.module'
import { InfoworkersModule } from './infoworkers/infoworkers.module'
import { RolesModule } from './roles/roles.module'
import { RulesModule } from './rules/rules.module'
import { RulesConditionsModule } from './rules-conditions/rules-conditions.module'

// entities
import { Infoworker } from './infoworkers/entities/infoworker.entity'
import { User } from './users/entities/user.entity'
import { Role } from './roles/entities/role.entity'
import { Rule } from './rules/entities/rule.entity'
import { RulesCondition } from './rules-conditions/entities/rules-condition.entity'
import { ImagesModule } from './images/images.module'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config.DB.HOST,
      port: Number(config.DB.PORT),
      password: config.DB.PASSWORD,
      username: config.DB.USERNAME,
      database: config.DB.DATABASE,
      entities: [User, Infoworker, Role, Rule, RulesCondition],
      synchronize: true,
      logging: true,
      ssl: true,
    }),
    JwtModule.register({
      global: true,
      secret: config.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    UsersModule,
    InfoworkersModule,
    RolesModule,
    RulesModule,
    RulesConditionsModule,
    ImagesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
