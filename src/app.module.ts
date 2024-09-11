import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { config } from '@/common/config/config'

// modules
import { UsersModule } from './users/users.module'
import { InfoworkersModule } from './infoworkers/infoworkers.module'

// entities
import { Infoworker } from './infoworkers/entities/infoworker.entity'
import { User } from './users/entities/user.entity'
import { RolesModule } from './roles/roles.module'
import { Role } from './roles/entities/role.entity'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config.DB.HOST,
      port: Number(config.DB.PORT),
      password: config.DB.PASSWORD,
      username: config.DB.USERNAME,
      database: config.DB.DATABASE,
      entities: [User, Infoworker, Role],
      synchronize: true,
      logging: true,
      ssl: true,
    }),
    UsersModule,
    InfoworkersModule,
    RolesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
