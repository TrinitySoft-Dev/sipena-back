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
import { ImagesModule } from './images/images.module'
import { TimesheetModule } from './timesheet/timesheet.module'
import { ContainerModule } from './container/container.module'

// entities
import { Infoworker } from './infoworkers/entities/infoworker.entity'
import { User } from './users/entities/user.entity'
import { Role } from './roles/entities/role.entity'
import { Rule } from './rules/entities/rule.entity'
import { Timesheet } from './timesheet/entities/timesheet.entity'
import { Container } from './container/entities/container.entity'
import { ConditionGroupsModule } from './condition_groups/condition_groups.module'
import { ConditionsModule } from './conditions/conditions.module'
import { ConditionGroup } from './condition_groups/entities/condition_group.entity'
import { Condition } from './conditions/entities/condition.entity'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config.DB.HOST,
      port: Number(config.DB.PORT),
      password: config.DB.PASSWORD,
      username: config.DB.USERNAME,
      database: config.DB.DATABASE,
      entities: [User, Infoworker, Role, Rule, Timesheet, Container, ConditionGroup, Condition],
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
    ImagesModule,
    TimesheetModule,
    ContainerModule,
    ConditionGroupsModule,
    ConditionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
