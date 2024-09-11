import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { config as env } from '@/common/config/config'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { ReponseInterceptor } from './common/interceptors/response.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )

  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new ReponseInterceptor())

  const config = new DocumentBuilder()
    .setTitle('Backend API')
    .setDescription('Backend API Sipena')
    .setVersion('1.0')
    .addTag('Users')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  app.setGlobalPrefix('/api')
  await app.listen(env.PORT)
}
bootstrap()
