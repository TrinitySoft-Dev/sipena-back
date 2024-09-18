import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { config as env } from '@/common/config/config'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { ReponseInterceptor } from './common/interceptors/response.interceptor'
import { BasicAuthMiddleware } from './middlewares/swagger-auth.middleware'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )

  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new ReponseInterceptor())
  app.setGlobalPrefix('/api')

  const config = new DocumentBuilder()
    .setTitle('Backend API')
    .setDescription('Backend API Sipena')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Users')
    .build()

  const document = SwaggerModule.createDocument(app, config)

  app.use('/api/docs', new BasicAuthMiddleware().use)

  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Sipena API',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css',
    ],
  })

  await app.listen(env.PORT)
}
bootstrap()
