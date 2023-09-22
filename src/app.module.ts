import { INestApplication, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { configValidationSchema } from './config/config.schema';
import { LocationModule } from './resources/location/location.module';
import { AuthModule } from './resources/auth/auth.module';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { NotificationModule } from './resources/notification/notification.module';
import { UserModule } from './resources/user/user.module';
import { CompanyModule } from './resources/company/company.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CustomExceptionFilter } from './middleware/custom-exception.filter';
import { OtpModule } from './resources/otp/otp.module';
import { CodeModule } from './resources/code/code.module';
import { ResponseInterceptor } from './helpers/response.interceptor';
import { ActivityModule } from './resources/activity/activity.module';
import { VisitorModule } from './resources/vms/token/visitor.module';
import { EventsModule } from './resources/events/event.module';
import { RabbitMQModule } from './services/rabbitMQ/rabbitmq.module';

@Module({
  // providers: [
  //   {
  //     provide: APP_FILTER,
  //     useClass: CustomExceptionFilter,
  //   },
  // ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    // {
    //   provide: APP_FILTER,
    //   useClass: CustomExceptionFilter,
    // },
  ],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.stage.${process.env.STAGE}`,
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    AuthModule,
    LocationModule,
    NotificationModule,
    UserModule,
    CompanyModule,
    OtpModule,
    CodeModule,
    ActivityModule,
    VisitorModule,
    EventsModule,
    RabbitMQModule,
  ],
  controllers: [AppController],
})
export class AppModule {
  configureSwagger(app: INestApplication): void {
    const options = new DocumentBuilder()
      .setTitle('Quixcel Estate Server Documentation')
      .setDescription(
        'This is the swagger documentation of some of the quixcel estates endpoints.',
      )
      .setVersion('1.0')
      .addServer('https://quixcel-estates-server-0a61bd1c8d09.herokuapp.com') // server url
      // .addTag('') // Add tags if needed
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api/v1/docs', app, document);
  }
}
