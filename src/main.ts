import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './config/transform.interceptor';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { RedisAdapter, createAdapter } from 'socket.io-redis';

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

  // Create an instance of RedisAdapter with your Redis credentials
  const redisOptions = {
    host: 'redis-18076.c78.eu-west-1-2.ec2.cloud.redislabs.com',
    port: 18076,
    auth_pass: 'I1FUSxaV05OmfEJPouyDWuFKCNyAtb9S',
  };

  await app.listen(port);
  logger.log(`Balosh Automation Server is running on PORT: ${port}`);
}
bootstrap();
