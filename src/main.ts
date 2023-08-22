import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './config/transform.interceptor';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enable CORS if needed
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api/v1');
  app.useGlobalInterceptors(new TransformInterceptor());

  const port = process.env.PORT;
  const appModule = app.get(AppModule);
  appModule.configureSwagger(app);
  await app.listen(port);
  logger.log(`Balosh Automation Server is running on PORT: ${port}`);
}
bootstrap();
