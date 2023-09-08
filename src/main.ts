import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { Logger } from '@nestjs/common'
import { TransformInterceptor } from './transform.interceptor'

async function bootstrap() {
  const logger = new Logger()
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalInterceptors(new TransformInterceptor())
  await app.listen(3000)
  logger.log(`Application listening on port 3000`)
}
bootstrap()
