import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './config/transform.interceptor';
import { Transport } from '@nestjs/microservices';

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
  // const redisOptions = {
  //   host: 'redis-18076.c78.eu-west-1-2.ec2.cloud.redislabs.com',
  //   port: 18076,
  //   auth_pass: 'I1FUSxaV05OmfEJPouyDWuFKCNyAtb9S',
  // };
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [
        'amqps://ksssykry:gWHv3uH2u7Vu4fNHzk3Lc7rjn35P32Td@whale.rmq.cloudamqp.com/ksssykry',
      ],
      queue: 'notifications_queues',
      queueOptions: { durable: false },
    },
  });

  // await app.startAllMicroservices();
  await app.listen(port);
  logger.log(`Banicoop Server is running on PORT: ${port}`);
}
bootstrap();
