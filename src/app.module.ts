import { INestApplication, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { configValidationSchema } from './config/config.schema';
import { AppController } from './app.controller';

import { APP_INTERCEPTOR } from '@nestjs/core';

import { ResponseInterceptor } from './helpers/response.interceptor';

import { ScheduleModule } from '@nestjs/schedule';
import { ContributionModule } from './resources/contribution/contribution.module';
import { SystemConfigDto } from './config/systemConfig';
import { DatabaseModule } from './services/database/database.module';
import { DatabaseService } from './services/database/database.service';
import { UserModule } from './resources/user/user.module';
import { ActivityModule } from './resources/activity/activity.module';
import IpwhoisService from './services/ipwhois/IpwhoisService';
import { JwtModule } from '@nestjs/jwt';
import { OtpModule } from './resources/otp/otp.module';
import { TwilioModule } from './services/twilio/twilio.module';
import { AuthModule } from './resources/auth/auth.module';
import { WalletModule } from './resources/wallet/wallet.module';
import { TransactionModule } from './resources/transactions/transaction.module';
import { PinModule } from './resources/pin/pin.module';
import { KycModule } from './resources/kyc/kyc.module';
import { LoanModule } from './resources/loan/loan.module';
import { SavingsModule } from './resources/savings/savings.module';
import { BillModule } from './resources/bills/bills.module';
import { CacheModule } from '@nestjs/cache-manager';
import { SystemSpecModule } from './services/system-spec/systemSpec.module';
import { TourModule } from './resources/tour/tour.module';
import { ClubLocationModule } from './resources/club-location/club-location.module';
import { EventModule } from './resources/events/events.module';
import { VisitorModule } from './resources/vms/token/visitor.module';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    // {
    //   provide: DatabaseService,
    //   useFactory: async (configService: ConfigService) => {
    //     const dbConnString = configService.get<string>(
    //       SystemConfigDto.DATABASE_URL,
    //     );
    //     console.log(dbConnString);

    //     if (!dbConnString) {
    //       throw new Error('Failed to load DATABASE_URL value');
    //     }

    //     const dbService = new DatabaseService();

    //     await dbService.initialize();
    //     return dbService;
    //   },
    //   inject: [ConfigService],
    // },
    // IpwhoisService,
    // {
    //   provide: DatabaseService,
    //   useFactory: async (configService: ConfigService) => {
    //     const dbConnString = configService.get(
    //       SystemConfigDto.DATABASE_URL,
    //     );

    //     if (!dbConnString) {
    //       throw new Error('Failed to load DATABASE_URL value');
    //     }

    //     const dbService = new DatabaseService();

    //     await dbService.initialize();
    //     return dbService;
    //   },
    // }
  ],

  imports: [
    ConfigModule.forRoot({
      validationSchema: configValidationSchema,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    OtpModule,
    UserModule,
    PinModule,
    WalletModule,
    // KycModule,
    // ContributionModule,
    DatabaseModule,
    TransactionModule,
    TourModule,
    ClubLocationModule,
    ActivityModule,
    VisitorModule,
    TwilioModule,
    // LoanModule,
    // SavingsModule,
    // BillModule,
    EventModule,
    SystemSpecModule,
    JwtModule.register({
      global: true,
      //secret: systemConfig().JWT_SALT, //please change the salt
    }),

    CacheModule.register(),
  ],
  controllers: [AppController],
})
export class AppModule {
  configureSwagger(app: INestApplication): void {
    const options = new DocumentBuilder()
      .setTitle('Boat Club Server Documentation')
      .setDescription(
        'This is the swagger documentation of some of the boat club endpoints.',
      )
      .setVersion('1.0')
      .addServer('https://boat-club-server.onrender.com') // server url
      // .addTag('') // Add tags if needed
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api/v1/docs', app, document);
  }
}
