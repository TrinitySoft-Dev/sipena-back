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
import { ConditionGroupsModule } from './condition_groups/condition_groups.module'
import { ConditionsModule } from './conditions/conditions.module'
import { WorkModule } from './work/work.module'
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config.DB.HOST,
      port: Number(config.DB.PORT),
      password: config.DB.PASSWORD,
      username: config.DB.USERNAME,
      database: config.DB.DATABASE,
      autoLoadEntities: true,
      synchronize: false,
      // logging: true,
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
    WorkModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
