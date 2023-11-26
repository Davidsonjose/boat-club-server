import { Module, forwardRef } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { DatabaseService } from 'src/services/database/database.service';
import { DatabaseModule } from 'src/services/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { OtpModule } from '../otp/otp.module';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => UserModule),
    forwardRef(() => OtpModule),
  ],
  providers: [ActivityService, DatabaseService],
  controllers: [ActivityController],
  exports: [ActivityService],
})
export class ActivityModule {}
