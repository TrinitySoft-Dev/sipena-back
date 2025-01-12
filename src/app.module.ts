import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { ServeStaticModule } from '@nestjs/serve-static'

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
import { ProductsModule } from './products/products.module'
import { ContainerSizeModule } from './container_size/container_size.module'
import { join } from 'path'
import { EmailModule } from './email/email.module'
import { PasswordHashModule } from './password_hash/password_hash.module'
import { TimesheetWorkersModule } from './timesheet_workers/timesheet_workers.module'
import { ExtraRulesModule } from './extra_rules/extra_rules.module'
import { RulesWorkersModule } from './rules_workers/rules_workers.module'
import { PermissionsModule } from './permissions/permissions.module'
import { CityModule } from './city/city.module'
import { StateModule } from './state/state.module'
import { LoggerModule } from 'nestjs-pino'
import { TemplateModule } from './template/template.module'
import { TemplateColumnsModule } from './template_columns/template_columns.module'
import { InvoiceModule } from './invoice/invoice.module'
import { WorkFieldsModule } from './work_fields/work_fields.module'
import { GroupPermissionsModule } from './group_permissions/group_permissions.module'
import { ExtraRulesWorkersModule } from './extra_rules_workers/extra_rules_workers.module'
import { AdminEmailsModule } from './admin_emails/admin_emails.module'
import { NormalScheduleModule } from './normal_schedule/normal_schedule.module'
import { OvertimesModule } from './overtimes/overtimes.module'
import { OvertimesWorkerModule } from './overtimes_worker/overtimes_worker.module'
import { TimezoneMiddleware } from './middlewares/timezone.middleware'

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  messageKey: 'message',
                },
              }
            : undefined,
        messageKey: 'message',
        serializers: {
          req(req) {
            return undefined
          },
          res(res) {
            return undefined
          },
        },
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config.DB.HOST,
      port: Number(config.DB.PORT),
      password: config.DB.PASSWORD,
      username: config.DB.USERNAME,
      database: config.DB.DATABASE,
      autoLoadEntities: true,
      synchronize: false,
      ssl: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
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
    ContainerSizeModule,
    EmailModule,
    PasswordHashModule,
    TimesheetWorkersModule,
    ExtraRulesModule,
    RulesWorkersModule,
    PermissionsModule,
    CityModule,
    StateModule,
    TemplateModule,
    TemplateColumnsModule,
    InvoiceModule,
    WorkFieldsModule,
    GroupPermissionsModule,
    ExtraRulesWorkersModule,
    AdminEmailsModule,
    NormalScheduleModule,
    OvertimesModule,
    OvertimesWorkerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TimezoneMiddleware).forRoutes('*')
  }
}
